import { join } from 'path';

const useTestCase = (): {
    utilAsset(file: string): string;
} => {
    const utilAsset = (file: string): string => {
        return join(__dirname, 'assets', file);
    };

    return {
        utilAsset,
    };
};
export { useTestCase };
