import { globSync } from 'glob'

export const TEXT = {
    SEARCH_ERROR: '❌ Error while searching for JavaScript files: ',
    FILES_FOUND: '❌ Please, move the following .js files to Typescript:',
    SUCCESS: '✅ OK: No JavaScript files found.',
} as const

export const getFiles = () => {
    const files = globSync('**/*.js', {
        ignore: ['node_modules/**', 'coverage/**', 'dist/**'],
        nodir: true,
    })
    return files
}

export const checkJsFiles = () => {
    try {
        const files = getFiles()

        if (files?.length) {
            console.error(TEXT.FILES_FOUND)
            console.group()
            files.forEach((file: string) => console.error(`- ${file}`))
            console.groupEnd()
            process.exit(1)
        }

        console.log(TEXT.SUCCESS)
    } catch (error) {
        console.error(TEXT.SEARCH_ERROR, error)
        process.exit(1)
    }
}

export default checkJsFiles()
