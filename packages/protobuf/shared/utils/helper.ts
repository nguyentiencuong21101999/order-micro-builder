export const splitChunks = <T>(source: T[], size: number) => {
    const chunks: T[][] = []
    for (let i = 0; i < source.length; i += size) {
        chunks.push(source.slice(i, i + size))
    }
    return chunks
}
