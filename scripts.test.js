/**
 * @jest-environment jsdom
 */
// const { before, beforeEach, it, describe }
const { fetchDictionaryData } = require("./scripts");
// const { displayDefinition } = require("./scripts");
// const { displayError } = require("./scripts");
//  const { JSDOM } = require("jsdom");


describe('fetchDictionaryData', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
        document.body.innerHTML = `
            <div id="definition-display"></div>
            <div id="error-message"></div>
        `;
    }
    );
    it('should fetch dictionary data for a valid word', async () => {
        const mockData = [{
            word: "test",
            phonetic: "/tɛst/",
            phonetics: [{ audio: "https://example.com/audio/test.mp3" }],
            meanings: [{
                definitions: [{ definition: "A procedure intended to establish the quality, performance, or reliability of something." }],
                synonyms: ["exam", "quiz"]
            }]
        }];

        global.fetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockData)
        });

        const data = await fetchDictionaryData("test");
        expect(data).toEqual(mockData);
        expect(document.getElementById('definition-display').innerHTML).toContain("A procedure intended to establish the quality");
    });
    it('should handle errors when the word is not found', async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            statusText: 'Not Found'
        });

        await expect(fetchDictionaryData("nonexistentword")).rejects.toThrow('word not found');
        expect(document.getElementById('error-message').innerHTML).toContain('word not found');
    });
    it('should return an "None" message for synonyms if none are found', async () => {
        const mockData = [{
            word: "test",
            phonetic: "/tɛst/",
            phonetics: [{ audio: "https://example.com/audio/test.mp3" }],
            meanings: [{
                definitions: [{ definition: "A procedure intended to establish the quality, performance, or reliability of something." ,
                synonyms: []
                }]
            }]
        }];

        global.fetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockData)
        });

        await fetchDictionaryData("test");
        expect(document.getElementById('definition-display').innerHTML).toContain("Synonyms: None");
    }
    );          
});