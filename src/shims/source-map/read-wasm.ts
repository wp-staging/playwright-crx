// @ts-ignore
import mappingsUrl from './mappings.wasm?url';

export default async function readWasm() {
  if (mappingsUrl.startsWith('data:')) {
    const [,base64] = mappingsUrl.split(',');
    return Buffer.from(base64, 'base64').buffer;
  }
  const response = await fetch(mappingsUrl);
  return await response.arrayBuffer();
};

export const initialize = () => {
  // nothing to do
};
