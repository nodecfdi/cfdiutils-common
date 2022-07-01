import { join } from 'path';

export class TestCase {
    public static utilAsset(file: string): string {
        return join(__dirname, '_files', file);
    }
}
