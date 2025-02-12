// import throttleFunction from 'throttleit';

// export function throttle<T extends (...args: any[]) => any>(func: T, wait: number): T {
//     let lastCallTime = 0;
//     let timeoutId: ReturnType<typeof setTimeout> | null = null;

//     const throttled = function(this: any, ...args: any[]) {
//         const now = Date.now();
//         const remaining = wait - (now - lastCallTime);

//         if (remaining <= 0) {
//             if (timeoutId) {
//                 clearTimeout(timeoutId);
//                 timeoutId = null;
//             }
//             lastCallTime = now;
//             func.apply(this, args); // Invoke immediately
//         } else if (!timeoutId) {
//             timeoutId = setTimeout(() => {
//                 lastCallTime = Date.now();
//                 timeoutId = null;
//                 func.apply(this, args);
//             }, remaining);
//         }
//     } as T;

//     return throttled;
// }
import throttleFunction from 'throttleit';

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  waitMs: number | undefined,
): T {
  return waitMs != null ? throttleFunction(fn, waitMs) : fn;
}