import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const useTestCase = (): {
    utilAsset: (file: string) => string;
} => {
    const utilAsset = (file: string): string => join(dirname(fileURLToPath(import.meta.url)), '_files', file);

    return {
        utilAsset
    };
};

export { useTestCase };
