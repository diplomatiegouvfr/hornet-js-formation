#!/bin/bash
#
# Hornet-Builder-Wrapper
#

# --------------------------------------------------------
# Bootstrap phase: non sourced mode
#
if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
	set -e
	set -u
	
	PROGDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
else
	echo "Sourced mode is not supported" >&2; exit 127
fi

# --------------------------------------------------------
# LOG4HBW
#
LOG_PREFIX="[hbw]"

function log_debug() {
	local message="$@"

	[ -n "${DEBIAN_SCRIPT_DEBUG:-}" ] && log "DEBUG" "${message}";

	return $?
}

function log_info() {
	local message="$@"
	
	log "INFO" "${message}"
	return $?
}

log_error() {
	local message="$@"
	
	log "ERROR" "${message}"
}

function log() {
	local level="$1"
	shift
	local message="$@"

	case "${level}" in
		"DEBUG")
			[ -n "${DEBIAN_SCRIPT_DEBUG:-}" ] && echo "${LOG_PREFIX} DEBUG ${message}"
		;;

		*)
			echo "${LOG_PREFIX} ${level} ${message}"
		;;		
	esac

	return $?
}

# --------------------------------------------------------
#
#

NPM_EXEC="npm"
NODEJS_EXEC="node"

[ -z "${HB_PULLED_DIR:-}" ] && HB_PULLED_DIR="./node_modules/hornet-js-builder"
[ -z "${HB_BUILDER_CLI:-}" ] && HB_BUILDER_CLI="bin/builder-cli.js"

[ -z "${HB_INSTALL_BASEDIR:-}" ] && HB_INSTALL_BASEDIR=$(cd ~ ; pwd)"/.hbw"

function hbw_install_pulled_builder() {
	local pulledVersion=$(${NODEJS_EXEC} ${HB_PULLED_DIR}/${HB_BUILDER_CLI} --version 2>/dev/null)
	log_info "Pulled version: ${pulledVersion}"

	rm -Rf "${HB_INSTALL_BASEDIR}/${pulledVersion}"
	mkdir -p "${HB_INSTALL_BASEDIR}/${pulledVersion}/node_modules"
	rsync -ah ${HB_PULLED_DIR}/ ${HB_INSTALL_BASEDIR}/${pulledVersion}/
	rsync -ah ./node_modules/ ${HB_INSTALL_BASEDIR}/${pulledVersion}/node_modules/
	rm -Rf ./node_modules

	touch hb_version
	HB_VERSION="${pulledVersion}"
	echo "${HB_VERSION}" > hb_version

	log_info "Install pulled version DONE"
	return 0
}


function hbw_pull_builder() {
	local builderVersion="${1}"
	[ -z "${builderVersion}" ] && builderVersion="latest"

	local installReportLog=$(mktemp)
	${NPM_EXEC} install hornet-js-builder@${builderVersion} 2>&1 1>${installReportLog}
	local returnCode=$?

	if [ ! ${returnCode} -eq 0 ]; then
		log_error "Hornet-js-builder version ${builderVersion} is not pulled properly"
		cat ${installReportLog}
	fi

	rm -f ${installReportLog}

	log_info "Builder version ${builderVersion} pulled DONE"
	return ${returnCode}
}

function hbw_is_version_installed() {
	local targetVersion="${1:-}"

	

	case "${targetVersion}" in
		"latest")
			if [ ! -z "${HB_VERSION:-}" ] && [ ! "${HB_VERSION:-}" == "latest" ]; then
				local installedVersion=$(${NODEJS_EXEC} ${HB_INSTALL_BASEDIR}/${HB_VERSION}/${HB_BUILDER_CLI} --version 2>/dev/null || true)
				if [[ "${HB_VERSION}" == "${installedVersion}" ]]; then
					return 0
				fi
				targetVersion="${installedVersion}"
			fi
		;;

		*)
			if [ "${targetVersion}" == "${HB_VERSION:-}" ]; then
				local installedVersion=$(${NODEJS_EXEC} ${HB_INSTALL_BASEDIR}/${HB_VERSION}/${HB_BUILDER_CLI} --version 2>/dev/null || true)
				if [[ "${HB_VERSION}" == "${installedVersion}" ]]; then
					return 0
				fi
			fi
		;;

	esac

	hbw_pull_builder "${targetVersion}" \
		&&	hbw_install_pulled_builder

	return $?
}

function hbw_run() {
	if [ -z "${HB_VERSION:-}" ]; then
		hbw_die "Variable HB_VERSION must be set"
	else
		hbw_is_version_installed "${HB_VERSION}";
	fi

	${NODEJS_EXEC} ${HB_INSTALL_BASEDIR}/${HB_VERSION}/${HB_BUILDER_CLI} $@
	
	return $?
}


###
#
#
function hbw_die() {
	[ $# -ne 0 ] &&  log_error "$@" >&2
	hbw_help
	exit 1
}

###
# Script version
#
function hbw_version() {
    echo -e "${HBW_MAIN_SCRIPT} version ${HBW_VERSION}"
	echo -e "builder-cli version" $(hbw_run --version)
}

###
# Script usage
#
function hbw_usage() {
    hbw_version
	echo -e " --------------------------------------------------------"
	echo -e ""
    echo -e "  Usage: ${HBW_MAIN_SCRIPT} [-wv|--wrapper-version] [-wh|--wrapper-help]"
    echo -e "            [--is-version-installed <hbVersion>]"
    echo -e ""
}

###
# Script help
#
function hbw_help() {
    hbw_usage
	echo -e "  Options ${HBW_MAIN_SCRIPT}:"
	echo -e ""
	echo -e "    -wv, --wrapper-version    Afficher la version de cet outil"
	echo -e "    -wh, --wrapper-help       Afficher cette aide"
	echo -e ""
	echo -e "    --is-version-installed    Vérifier si la version de hornet-builder est installée"
	echo -e "                              Si aucun argument, la variable HB_VERSION"
	echo -e "                              est lue pour tenter cette vérification."
	echo -e ""
	echo -e " --------------------------------------------------------"
	echo -e ""
	hbw_run --help
}

function hbw_main() {
	HBW_TASK="${1:-}"

	[ -z "${HB_VERSION:-}" ] && HB_VERSION=$(cat hb_version 2>/dev/null || true);
	
    ###
    # Command line router
    #
    case "${HBW_TASK}" in
		"--wrapper-version"|"-wv")
            hbw_version
		;;

        "--wrapper-help"|"-wh")
            hbw_help
		;;

        "--is-version-installed")
			shift
			local builderVersion="${1:-}"
        	hbw_is_version_installed "${builderVersion}"
        	return $?
        ;;

        *)
			hbw_run $*
        	return $?
		;;
    esac
	
	return 0
}

# --------------------------------------------------------
# Globals
#
HBW_MAIN_SCRIPT="hbw"
HBW_VERSION="1.0.0"

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
	hbw_main $*
	exit $?
fi
#
# Fin de hornet-builder-wrapper
# --------------------------------------------------------

