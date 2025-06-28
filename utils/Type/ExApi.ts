// types.ts
export interface DictionaryApiResponse {
    word: string;
    meanings: Meaning[];
    phonetics: Phonetic[];
}

export interface Phonetic {
    text: string;
    audio: string;
}

export interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
}

export interface Definition {
    definition: string;
    example?: string;
}

//custom response
export interface Meanings{
    id:string;
    type:string;
    definition:string;
    examples:string[] | null;
    verb_forms:{
        base_form:string;
        past_simple:string;
        past_participle:string;
        present_participle:string;
        third_person_singular:string;
    }|null;
}
export type ProcessedResult = {
    word: string;
    meanings: Meanings[];
}


