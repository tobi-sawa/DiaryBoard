from langrid.clients import TranslationClient
from settings import lg_config

# 入力言語および出力言語のリスト
languages = {
    1: 'ja',
    2: 'en',
    3: 'pt',
    4: 'es',
    5: 'zh-CN',
    6: 'zh-TW',
    7: 'ko',
    8: 'tl',
    9: 'vi',
    10: 'id',
    11: 'ne'
}


def translate_to_all_languages(source_lang, text):
    # Langrid TranslationClientの初期化
    gnmt = TranslationClient('https://langrid.org/service_manager/wsdl/kyoto1.langrid:GoogleTranslateNMT',
                             lg_config['userid'], lg_config['password'])

