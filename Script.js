const fs = require('node:fs')
const path = require('node:path')
const readLine = require('node:readline')

run()

function escapeHtmlSpeacialCharacters(text) {
    return text.replace(/[<>&]/g, (match) => {
        switch (match) {
        case "<":
            return "&lt;"
        case ">":
            return "&gt;"
        case "&":
            return "&amp;"
        default:
            return match
        } 
    })
}

function escapeHtmlFile(inputFilePath, outputFilePath) {
    try {
        const fileContent = fs.readFileSync(inputFilePath, "utf-8")
        const escapedContent = escapeHtmlSpeacialCharacters(fileContent)
        fs.writeFileSync(outputFilePath, escapedContent, "utf-8")
        console.log(`Arquivo escapado com sucesso ${outputFilePath}`)
    } catch (error) {
        console.log("Erro:", error.message)
        process.exit(1)        
    }
}

function askFilePath(question) {
    const rl = readLine.createInterface({ input: process.stdin, output: process.stdout})

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer)
            rl.close()
        })
    })
}

async function startUserInteraction() {
    let inputPath = process.argv[2] 
    if (!inputPath) {
        inputPath = await askFilePath("Informe o caminho do arquivo de entrada:")
    }   
    inputPath = path.resolve(inputPath)

    const defalutName = `escaped_${path.basename(inputPath)}.txt`
    const answer = await askFilePath(`Informe o caminho do arquivo de saida (padrão ${defalutName}): `)
    let outputhPath = answer.lenght > 0 ? answer : defalutName
    outputhPath = path.resolve(outputhPath)

    escapeHtmlFile(inputPath, outputhPath)
}

function run() {
    if (process.argv >= 4) {
        escapeHtmlFile(
            path.resolve(process.argv[2]), 
            path.resolve(process.argv[3])
 )   
} else {
    console.log("----------------------")
    console.log("HTML Tag Escaper V1.0")
    console.log("----------------------\n")
    console.log("Argumentos não informados! Por favor, informe os caminhos dos arquivos para realizar o escape")
    startUserInteraction()
}
}