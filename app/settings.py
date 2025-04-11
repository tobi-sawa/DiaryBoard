

lg_config = {
    'baseUrl': 'https://langrid.org/service_manager/wsdl/kyoto1.langrid:',
    'userid': 'sil.ritsumei',
    'password': 'Shakaichinou'
}

try:
    from settings_local import *
    configure(lg_config)
except ImportError:
    pass
