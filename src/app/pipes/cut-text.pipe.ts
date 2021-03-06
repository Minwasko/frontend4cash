import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cutText'
})
export class CutTextPipe implements PipeTransform {

  transform(value: string, maxLength: number = 150, fadeStart: number = 120): string {
    if(value.length > maxLength) {
      let ret = value.substring(0, fadeStart);
      ret += `<span class="fading-text">${value.substring(fadeStart, maxLength)}...</span>`;
      return ret;
    }
    else return value;
  }

}
