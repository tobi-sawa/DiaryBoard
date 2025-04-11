import json
from urllib import request

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

def convert_diary(content, age):
    """ 日記の文章をカナに変換する関数 """
    print(f"📘 変換中の日記: {content}")

    # Yahoo API にリクエストを送る
    response = post(content, age)

    # 変換されたカナ文字を取得（失敗時は元の文章）
    kana_diary = convert_to_kana(response, content)

    print(f"✅ 変換後の日記: {kana_diary}")
    return kana_diary
