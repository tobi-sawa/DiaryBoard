from suds.client import Client
from suds.sax.element import Element
import base64
import json


class BindingNode:
    def __init__(self, invocationName, serviceId, gridId = None):
        self.invocationName = invocationName
        self.gridId = gridId
        self.serviceId = serviceId
        self.children = []

    def addChildren(self, child):
        self.children.append(child)
        return self

    def getChildren(self):
        return self.children

    def getInvocationName(self):
        return self.invocationName

    def getGridId(self):
        return self.gridId

    def getServiceId(self):
        return self.serviceId

    def setChildren(self, children):
        self.children = children

    def setInvocationName(self, invocationName):
        self.invocationName = invocationName

    def setGridId(self, gridId):
        self.gridId = gridId

    def setServiceId(self, serviceId):
        self.serviceId = serviceId


class LangridClient:
    def __init__(self, url, username, password):
        self.url = url
        header_value = ('%s:%s' % (username, password)).encode('utf-8')
        auth_header = {
            "Authorization": "Basic %s" % base64.b64encode(header_value).decode('utf-8').replace('\n', '')
        }
        self.client = Client(url, headers=auth_header, cachingpolicy=1)
        self.treeBindings = []
        self.jsonBindings = None

    def getTreeBindings(self):
        return self.treeBindings

    #private
    def encodeTree(self):
        return json.dumps(self.treeBindings, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)

    #private
    def setBinding(self):
        if self.jsonBindings == None:
            self.jsonBindings = self.encodeTree()
        ns3 = ('ns3', 'http://langrid.nict.go.jp/process/binding/tree')
        binding = Element('binding', ns=ns3).setText(self.jsonBindings)
        self.client.set_options(soapheaders=binding)

    def setJsonBindings(self, json):
        self.jsonBindings = json


class AdjacencyPairClient(LangridClient):
    def __init__(self, url, username, password):
        super().__init__(url, username, password)

    def createTranslation(self):
        return self.client.factory.create('ns1:Translation')

    def search(self, category, language, firstTurn, matchingMethod):
        self.setBinding()
        return self.client.service.search(category, language, firstTurn, matchingMethod)


class BackTranslationClient(LangridClient):
    def __init__(self, url, username, password):
        super().__init__(url, username, password)

    def backTranslate(self, sourceLang, intermediateLang, source):
        self.setBinding()
        return self.client.service.backTranslate(sourceLang, intermediateLang, source)


class BackTranslationWithTemporalDictionaryClient(LangridClient):
    def __init__(self, url, username, password):
        super().__init__(url, username, password)

    def createTranslation(self):
        return self.client.factory.create('ns1:Translation')

    def backTranslate(self, sourceLang, intermediateLang, source, temporalDict, dictTargetLang):
        self.setBinding()
        return self.client.service.backTranslate(sourceLang, intermediateLang, source, temporalDict, dictTargetLang)


class BilingualDictionaryClient(LangridClient):
    def __init__(self, url, username, password):
        super().__init__(url, username, password)

    def search(self, headLang, targetLang, headWord, matchingMethod):
        self.setBinding()
        return self.client.service.search(headLang, targetLang, headWord, matchingMethod)

    def getLastUpdate(self):
        self.setBinding()
        return self.client.service.getLastUpdate()

    def getSupportedLanguagePairs(self):
        self.setBinding()
        return self.client.service.getSupportedLanguagePairs()

    def getSupportedMatchingMethods(self):
        self.setBinding()
        return self.client.service.getSupportedMatchingMethods()


class BilingualDictionaryWithLongestMatchSearchClient(LangridClient):
    def __init__(self, url, username, password):
        super().__init__(url, username, password)

    def search(self, headLang, targetLang, morphemes):
        self.setBinding()
        return self.client.service.search(headLang, targetLang, morphemes)


class ConceptDictionaryClient(LangridClient):
    def __init__(self, url, username, password):
        super().__init__(url, username, password)

    def getRelatedConcepts(self, language, conceptId, relation):
        self.setBinding()
        return self.client.service.getRelatedConcepts(language, conceptId, relation)

    def searchConcepts(self, Language, word, matchingMethod):
        self.setBinding()
        return self.client.service.searchConcepts(Language, word, matchingMethod)


class DependencyParserClient(LangridClient):
    def __init__(self, url, username, password):
        super().__init__(url, username, password)

    def parseDependency(self, language, sentence):
        self.setBinding()
        return self.client.service.parseDependency(language, sentence)


class LanguageIdentificationClient(LangridClient):
    def __init__(self, url, username, password):
        super().__init__(url, username, password)

    def identify(self, text, originalEncoding):
        self.setBinding()
        return self.client.service.identify(text, originalEncoding)


class MorphologicalAnalysisClient(LangridClient):
    def __init__(self, url, username, password):
        super().__init__(url, username, password)

    def analyze(self, language, text):
        self.setBinding()
        return self.client.service.analyze(language, text)


class MultihopTranslationClient(LangridClient):
    def __init__(self, url, username, password):
        super().__init__(url, username, password)

    def multihopTranslate(self, sourceLang, intermediateLangs, targetLang, source):
        self.setBinding()
        return self.client.service.multihopTranslate(sourceLang, intermediateLangs, targetLang, source)


class ParallelTextClient(LangridClient):
    def __init__(self, url, username, password):
        super().__init__(url, username, password)

    def search(self, sourceLang, targetLang, text, matchingMethod):
        self.setBinding()
        return self.client.service.search(sourceLang, targetLang, text, matchingMethod)


class ParaphraseClient(LangridClient):
    def __init__(self, url, username, password):
        super().__init__(url, username, password)

    def paraphrase(self, language, text):
        self.setBinding()
        return self.client.service.paraphrase(language, text)


class PictogramDictionaryClient(LangridClient):
    def __init__(self, url, username, password):
        super().__init__(url, username, password)

    def search(self, language, word, matchingMethod):
        self.setBinding()
        return self.client.service.search(language, word, matchingMethod)


class QualityEstimationClient(LangridClient):
    def __init__(self, url, username, password):
        super().__init__(url, username, password)

    def estimate(self, sourceLang, targetLang, source, target):
        self.setBinding()
        return self.client.service.estimate(sourceLang, targetLang, source, target)


class SimilarityCalculationClient(LangridClient):
    def __init__(self, url, username, password):
        super().__init__(url, username, password)

    def calculate(self, language, text1, text2):
        self.setBinding()
        return self.client.service.calculate(language, text1, text2)


class SpeechRecognitionClient(LangridClient):
    def __init__(self, url, username, password):
        super().__init__(url, username, password)

    def recognize(self, language, speech):
        self.setBinding()
        return self.client.service.recognize(language, speech)

    def getSupportedAudioTypes(self):
        self.setBinding()
        return self.client.service.getSupportedAudioTypes()

    def getSupportedLanguages(self):
        self.setBinding()
        return self.client.service.getSupportedLanguages()

    def getSupportedVoiceTypes(self):
        self.setBinding()
        return self.client.service.getSupportedVoiceTypes()


class TemplateParallelTextClient(LangridClient):
    def __init__(self, url, username, password):
        super().__init__(url, username, password)

    def generateSentence(self, language, templateId, boundChoiceParameters, boundValueParameters):
        self.setBinding()
        return self.client.service.generateSentence(language, templateId, boundChoiceParameters, boundValueParameters)

    def getCategoryNames(self, categoryId, languages):
        self.setBinding()
        return self.client.service.multihopTranslate(categoryId, languages)

    def getTemplatesByTemplateId(self,language, templateIds):
        self.setBinding()
        return self.client.service.getTemplatesByTemplateId(language, templateIds)

    def listTemplateCategories(self, language):
        self.setBinding()
        return self.client.service.listTemplateCategories(language)

    def searchTemplates(self, language, text, matchingMethod, categoryIds):
        self.setBinding()
        return self.client.service.searchTemplates(language, text, matchingMethod, categoryIds)


class TextToSpeechClient(LangridClient):
    def __init__(self, url, username, password):
        super().__init__(url, username, password)

    def speak(self, language, text, voiceType, audioType):
        self.setBinding()
        return self.client.service.speak(language, text, voiceType, audioType)

    def getSupportedAudioTypes(self):
        return self.client.service.getSupportedAudioTypes()

    def getSupportedLanguages(self):
        return self.client.service.getSupportedLanguages()

    def getSupportedVoiceTypes(self):
        return self.client.service.getSupportedVoiceTypes()


class TranslationClient(LangridClient):
    def __init__(self, url, username, password):
        super().__init__(url, username, password)

    def translate(self, sourceLang, targetLang, source):
        self.setBinding()
        return self.client.service.translate(sourceLang, targetLang, source)


class TranslationSelectionClient(LangridClient):
    def __init__(self, url, username, password):
        super().__init__(url, username, password)

    def createTranslation(self):
        return self.client.factory.create('ns1:Translation')

    def select(self, sourceLang, targetLang, source):
        self.setBinding()
        return self.client.service.select(sourceLang, targetLang, source)


class TranslationWithTemporalDictionaryClient(LangridClient):
    def __init__(self, url, username, password):
        super().__init__(url, username, password)

    def createTranslation(self):
        return self.client.factory.create('ns1:Translation')

    def translate(self, sourceLang, targetLang, source, temporalDict, dictTargetLang):
        self.setBinding()
        return self.client.service.translate(sourceLang, targetLang, source, temporalDict, dictTargetLang)
