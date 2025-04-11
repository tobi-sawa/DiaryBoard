from langrid.clients import TranslationClient
from settings import lg_config
import asyncio
from quiz_hiragana import convert_question
# 入力言語および出力言語のリスト
languages = {
    1: 'ja',  # 日本語
    2: 'en',  # 英語
    3: 'pt',  # ポルトガル語
    4: 'es',  # スペイン語
    5: 'zh-CN',  # 中国語（簡体字）
    6: 'zh-TW',  # 中国語（繁体字）
    7: 'ko',  # 韓国語
    8: 'tl',  # タガログ語
    9: 'vi',  # ベトナム語
    10: 'id',  # インドネシア語
    11: 'ne'  # ネパール語
}


async def translate_question(question, main_language):
    """
    指定された言語にクイズの質問を翻訳する関数。
    """
    gnmt = TranslationClient('http://langrid.org/service_manager/wsdl/kyoto1.langrid:GoogleTranslateNMT',
                             lg_config['userid'], lg_config['password'])
    lang = languages[main_language]

    # 翻訳の呼び出しを await で待機
    translated_question = gnmt.translate("ja", lang, question)
    return translated_question


import asyncio
async def translate_quizz(quiz_set,age):
    """
    複数のクイズセットをすべての言語に翻訳する
    """
    gnmt = TranslationClient('http://langrid.org/service_manager/wsdl/kyoto1.langrid:GoogleTranslateNMT', lg_config['userid'], lg_config['password'])
    translations_per_quiz_set = []  # すべてのクイズセットの翻訳結果を保持

    for i in range(0, len(quiz_set), 5):  # 5つごとに分割して処理
        quiz = quiz_set[i:i+5]  # 質問と選択肢を5つごとにまとめる
        translations_per_quiz = []  # 現在のクイズセットの翻訳結果を保持
        
        for target_lang_id, target_lang in languages.items():
            try:
                if target_lang_id == 1:  # 日本語（そのまま）
                    translation = await asyncio.gather(
                        asyncio.to_thread(convert_question,quiz[0],age),  # 質問
                        asyncio.to_thread(convert_question,quiz[1],age),  # 質問
                        asyncio.to_thread(convert_question,quiz[2],age),  # 質問
                        asyncio.to_thread(convert_question,quiz[3],age),  # 質問
                        asyncio.to_thread(convert_question,quiz[4],age),  # 質問
                    )
                else:
                    # 非同期で翻訳を取得
                    translation = await asyncio.gather(
                        asyncio.to_thread(gnmt.translate, "ja", target_lang, quiz[0]),  # 質問
                        asyncio.to_thread(gnmt.translate, "ja", target_lang, quiz[1]),  # 選択肢A
                        asyncio.to_thread(gnmt.translate, "ja", target_lang, quiz[2]),  # 選択肢B
                        asyncio.to_thread(gnmt.translate, "ja", target_lang, quiz[3]),  # 選択肢C
                        asyncio.to_thread(gnmt.translate, "ja", target_lang, quiz[4])   # 選択肢D
                    )
                
                # 翻訳結果をリストに追加
                translations_per_quiz.append(translation)
            except Exception as e:
                print(f"Error translating quiz: {quiz[0]} to {target_lang}. Error: {e}")
                # 翻訳失敗時は元のデータを返す
                translations_per_quiz.append(quiz)

        # 現在のクイズセットの翻訳結果を保存
        translations_per_quiz_set.append(translations_per_quiz)

    return translations_per_quiz_set
