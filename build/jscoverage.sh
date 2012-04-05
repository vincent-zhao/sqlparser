# ! /bin/bash
# vim: set expandtab tabstop=4 shiftwidth=4 foldmethod=marker: #

declare -r __PATH=`pwd`
declare -r __ROOT="$(dirname -- $(dirname -- $(readlink -f -- ${BASH_SOURCE[0]})))"
declare -r JSCOVE="${__ROOT}/bin/jscoverage"

# {{{ function install_jscoverage() #
function install_jscoverage() {
if [ ! -d "${__ROOT}/tmp" ] ; then
    mkdir -p "${__ROOT}/tmp"
fi

if [ ! -d "${__ROOT}/bin" ] ; then
    mkdir -p "${__ROOT}/bin"
fi

cd "${__ROOT}/tmp" && git clone git://github.com/visionmedia/node-jscoverage.git node-jscoverage && \
    cd node-jscoverage && ./configure && make && \
    cp ./jscoverage "${JSCOVE}" && chmod +x "${JSCOVE}" && rm -rf ${__ROOT}/tmp
}
# }}} #

if [ ! -f "${JSCOVE}" ] ; then
    install_jscoverage
fi

cd "${__PATH}"
