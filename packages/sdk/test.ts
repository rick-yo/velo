import { register } from './lib/main';

// stubFetch();

const dispose = register('http://localhost:3000', () => '/home');

setTimeout(() => {
  dispose();
}, 10000);

function stubFetch() {
  window.fetch = (input: RequestInfo | URL) => {
    console.log(input);
    return Promise.resolve(new Response(null));
  };
}
