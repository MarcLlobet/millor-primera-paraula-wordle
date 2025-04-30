import { searchCallback, checkJsFiles, TEXT } from './check-js-files';
import glob from 'glob';

const consoleLogSpy = jest.spyOn(console, 'log');
const consoleErrorSpy = jest.spyOn(console, 'error');

const mockProcessExit = jest.fn();

jest.mock('glob');

describe('checkJsFiles', () => {
  const originalExit = process.exit;
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    // @ts-ignore
    process.exit = mockProcessExit;
  });
  afterEach(() => {
    process.exit = originalExit;
  });

  describe('searchCallback', () => {
    describe('has an error searching files', () => {
      it('exits process', () => {
        searchCallback(new Error('glob error'), []);

        expect(mockProcessExit).toHaveBeenCalledWith(1);
      });

      it('logs an error', () => {
        searchCallback(new Error('glob error'), []);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          TEXT.SEARCH_ERROR,
          new Error('glob error'),
        );
      });
    });

    describe('returns a list of files', () => {
      it('exits process', () => {
        searchCallback(null, ['file1.js', 'file2.js']);

        expect(mockProcessExit).toHaveBeenCalledWith(1);
      });

      it('logs an error', () => {
        searchCallback(null, ['file1.js', 'file2.js']);

        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      it('logs returned files', () => {
        searchCallback(null, ['file1.js', 'file2.js']);

        expect(consoleErrorSpy).toHaveBeenCalledWith(TEXT.FILES_FOUND);
        expect(consoleErrorSpy).toHaveBeenCalledWith('- file1.js');
        expect(consoleErrorSpy).toHaveBeenCalledWith('- file2.js');
      });
    });

    describe('passes successfully: no errors, no files found', () => {
      it('logs a success message', () => {
        searchCallback(null, []);
        expect(consoleLogSpy).toHaveBeenCalledWith(TEXT.SUCCESS);
      });
    });
  });

  describe('checkJsFiles', () => {
    it('calls glob with the correct parameters', () => {
      checkJsFiles();
      expect(glob).toHaveBeenCalledWith(
        '**/*.js',
        expect.any(Object),
        searchCallback,
      );
    });
  });
});
