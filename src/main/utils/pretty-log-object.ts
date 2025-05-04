// import * as util from 'util'

export const prettyLogObject = (object: unknown): string =>
  // Pretty only for console transport
  // util.inspect(object, { showHidden: false, depth: null, colors: true })
  // Pretty for file transport and readeble for console transport
  JSON.stringify(object, null, 2)
