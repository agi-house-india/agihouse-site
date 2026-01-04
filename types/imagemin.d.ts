declare module 'imagemin' {
  interface Options {
    destination?: string
    plugins?: Array<(input: Buffer) => Promise<Buffer>>
  }

  function imagemin(
    input: string[],
    options?: Options
  ): Promise<Array<{ data: Buffer; sourcePath: string; destinationPath: string }>>

  namespace imagemin {
    function buffer(input: Buffer, options?: { plugins?: Array<(input: Buffer) => Promise<Buffer>> }): Promise<Buffer>
  }

  export default imagemin
}

declare module 'imagemin-jpegtran' {
  interface Options {
    progressive?: boolean
  }

  function imageminJpegtran(options?: Options): (input: Buffer) => Promise<Buffer>

  export default imageminJpegtran
}
