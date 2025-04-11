import json
from urllib import request

age_map = {
    "Elementary1": 1, "Elementary2": 2, "Elementary3": 3,
    "Elementary4": 4, "Elementary5": 5, "Elementary6": 6,
    "Junior1": 7, "Junior2": 7, "Junior3": 7,
    "Other": 8
}

APPID = "dj00aiZpPTZqbTZSOEVqdDZhaiZzPWNvbnN1bWVyc2VjcmV0Jng9Yzk-"
URL = "https://jlp.yahooapis.jp/FuriganaService/V2/furigana"

def post(query, grade):
    """ Yahoo API を使ってカナ文字変換する """
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Yahoo AppID: {}".format(APPID),
    }
    param_dic = {
        "id": "1234-1",
        "jsonrpc": "2.0",
        "method": "jlp.furiganaservice.furigana",
        "params": {
            "q": query,
            "grade": grade
        }
    }
    params = json.dumps(param_dic).encode()
    req = request.Request(URL, params, headers)

    try:
        with request.urlopen(req) as res:
            body = res.read()
        response_json = json.loads(body.decode())

        if "result" not in response_json or "word" not in response_json["result"]:
            print(f"⚠️ 変換失敗: {query}")
            return None  # 失敗した場合は `None` を返す

        return response_json

    except Exception as e:
        print(f"⚠️ APIリクエスト失敗: {e}")
        return None  # 失敗時は `None` を返す

def convert_to_kana(response, original_text):
    """ Yahoo API のレスポンスをカナ文字に変換 """
    if not response or "result" not in response:
        print(f"⚠️ 変換に失敗しました: {original_text}")
        return original_text  # 失敗した場合は元のテキストを返す

    result_text = ""
    for word in response["result"]["word"]:
        if "furigana" in word:
            result_text += word["furigana"]
        else:
            result_text += word["surface"]

    return result_text

def convert_quiz_to_kana(quiz_data, age):
    """ クイズデータの question と choices をカナに変換 """
    new_quiz_data = []

    if age not in age_map:
        print(f"⚠️ 無効な年齢 '{age}' が指定されました。デフォルトで 'Other' を使用します。")
        age = "Other"

    for quiz in quiz_data:
        # ✅ question を変換（失敗時は元のテキストを使用）
        response_question = post(quiz["question"], age_map[age])
        kana_question = convert_to_kana(response_question, quiz["question"])

        # ✅ choices を変換（失敗時は元のテキストを使用）
        kana_choices = []
        for choice in quiz["choices"]:
            response_choice = post(choice, age_map[age])
            kana_choices.append(convert_to_kana(response_choice, choice))

        new_quiz_data.append({
            "question": kana_question,
            "choices": kana_choices,
            "answer": quiz["answer"]
        })

    return new_quiz_data

def convert_question(question, age_group):
    """
    クイズの質問を、指定された `age_group` のカナ表記に変換する関数。
    `age_group` に応じて、質問文を簡単なカナに変換。
    """
    response = post(question, age_group)
    
    if response:
        return convert_to_kana(response, question)
    
    return question  # 変換失敗時は元の質問を返す