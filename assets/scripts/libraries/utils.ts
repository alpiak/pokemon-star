import { Label, Component } from 'cc';

async function showTextLikeTypeWriter(label: any, text: string, { property = "string", interval = 80, delay = 0, separator = "" } = {}) {
    const words = text.split(separator);

    label[property] = "";

    if (delay > 0) {
        await new Promise((r) => setTimeout(r, delay));
    }

    for (const word of words) {
        label[property] += separator + word;

        await new Promise((r) => setTimeout(r, interval));
    }
}

function startConversation(lines: string[], onNextLine: (nextLine: string) => void = () => {}, onEnd: () => void = () => {}, { autoPassTimeout = 0, delay = 0 } = {}) {
    const resolver = {
        resolve: (value: undefined) => {}
    };

    const generatePassPromise = () => {
        const promise = new Promise((r) => resolver.resolve = r);

        return promise;
    }

    let passPromise = generatePassPromise();

    const dialog = {
        pass: () => {
            resolver.resolve(undefined);
            passPromise = generatePassPromise();
        },
    };

    (async () => {
        if (delay > 0) {
            await new Promise((r) => setTimeout(r, delay));
        }
    
        for (const line of lines) {
            await onNextLine(line);
    
            if (autoPassTimeout > 0) {
                await Promise.race([
                    new Promise((r) => setTimeout(r, autoPassTimeout)),
                    passPromise,
                ]);
            } else {
                await passPromise;
            }
        }

        await onEnd();
    })();

    return dialog;
}

export { showTextLikeTypeWriter, startConversation };
