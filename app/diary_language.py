from diary_hiragana import convert_diary
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

def translate_diary(title, content, main_language,age):
    translations_list = []
    gnmt = TranslationClient('https://langrid.org/service_manager/wsdl/kyoto1.langrid:GoogleTranslateNMT',
                             lg_config['userid'], lg_config['password'])
    lang = languages[main_language]
    for target_lang_id in languages:
        target_lang = languages[target_lang_id]
        translation = []
        if target_lang == lang:
            translation.append(title)
            translation.append(content)
            translations_list.append(translation)
        else:
            translated_title = gnmt.translate(lang,target_lang,title)
            translated_content = gnmt.translate(lang,target_lang,content)
            if target_lang == "ja":
                converted_title = convert_diary(translated_title,age)
                converted_content = convert_diary(translated_content,age)
                translation.append(converted_title)
                translation.append(converted_content)
            else:
                translation.append(translated_title)
                translation.append(translated_content)
            translations_list.append(translation)
    return translations_list
   

def translate_content(content,language):
    gnmt = TranslationClient('https://langrid.org/service_manager/wsdl/kyoto1.langrid:GoogleTranslateNMT',
                             lg_config['userid'], lg_config['password'])
    lang = languages[language]
    translated_content = gnmt.translate(lang,"ja",content)
    return translated_content