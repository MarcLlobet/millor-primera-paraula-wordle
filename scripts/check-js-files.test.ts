import { vi, expect, describe, it, beforeEach } from 'vitest'
import { getFiles, checkJsFiles, TEXT } from './check-js-files'
import * as glob from 'glob'

const consoleLogSpy = vi.spyOn(console, 'log')
const consoleErrorSpy = vi.spyOn(console, 'error')
const processExitSpy = vi
    .spyOn(process, 'exit')
    .mockImplementation((() => {}) as never)

vi.mock('glob')

describe('checkJsFiles', () => {
    beforeEach(() => {
        vi.resetModules()
        vi.clearAllMocks()
    })

    describe('getFiles', () => {
        describe('has an error searching files', () => {
            it('exits process', () => {
                vi.mocked(glob.globSync).mockImplementationOnce(() => {
                    throw new Error('syncGlob error')
                })

                checkJsFiles()

                expect(processExitSpy).toHaveBeenCalledWith(1)
            })

            it('logs an error', () => {
                vi.mocked(glob.globSync).mockImplementationOnce(() => {
                    throw new Error('glob error')
                })

                checkJsFiles()

                expect(consoleErrorSpy).toHaveBeenCalledWith(
                    TEXT.SEARCH_ERROR,
                    expect.any(Error)
                )
            })
        })

        describe('returns a list of files', () => {
            it('does not exit the process', () => {
                vi.mocked(glob.globSync).mockImplementationOnce(() => [
                    'file1.js',
                    'file2.js',
                ])

                checkJsFiles()

                expect(processExitSpy).toHaveBeenCalled()
            })

            it('logs returned files', () => {
                vi.mocked(glob.globSync).mockImplementationOnce(() => [
                    'file1.js',
                    'file2.js',
                ])

                checkJsFiles()

                expect(consoleErrorSpy).toHaveBeenCalledWith(TEXT.FILES_FOUND)
                expect(consoleErrorSpy).toHaveBeenCalledWith('- file1.js')
                expect(consoleErrorSpy).toHaveBeenCalledWith('- file2.js')
            })
        })

        describe('passes successfully: no errors, no files found', () => {
            it('logs a success message', () => {
                vi.mocked(glob.globSync).mockImplementationOnce(() => [])

                checkJsFiles()

                expect(consoleLogSpy).toHaveBeenCalledWith(TEXT.SUCCESS)
            })
        })
    })

    describe('getFiles', () => {
        it('calls glob with the correct parameters', () => {
            getFiles()

            expect(glob.globSync).toHaveBeenCalledWith(
                '**/*.js',
                expect.any(Object)
            )
        })
    })
})
