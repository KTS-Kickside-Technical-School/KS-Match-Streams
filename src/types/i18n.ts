export type Locale = 'en' | 'zh-CN' | 'fr'

export type TranslationTree = {
    [key: string]: string | TranslationTree
}
