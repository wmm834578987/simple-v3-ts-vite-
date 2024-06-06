export function getUUID(): string {
  var s = [];
  var hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1) as string;
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] as string & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';
  var uuid = s.join('');
  return uuid;
}


export function throttle<T extends (...args: any[]) => any>(fn: T, delay = 300) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer == null) {
      timer = setTimeout(() => {
        fn.apply(this, args);  // 使用 apply 来调用 fn
        clearTimeout(timer as number);
        timer = null;
      }, delay);
    }
  }
}
export function getImageUrl(name: string | number) {
  return new URL(`/src/assets/img/${name}`, import.meta.url).href;
}

export function downloadImage(url: string, fileName: string) {
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      var a = document.createElement("a") as HTMLAnchorElement;
      a.download = fileName;
      a.href = URL.createObjectURL(blob);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
}

