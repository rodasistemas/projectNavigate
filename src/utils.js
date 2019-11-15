import { Platform, PixelRatio } from 'react-native';

export function getPixelSize(pixels){
    return Platform.select({
        ios: pixels,
        android: PixelRatio.getPixelSizeForLayoutSize(pixels)
    })
}

export function toTime (s){
    const duas_casas = numero => {
      if (numero <= 9) {
        numero = "0" + numero;
      }
      return numero;
    };

    hora = duas_casas(Math.round(s / 3600));
    minuto = duas_casas(Math.floor((s % 3600) / 60));
    segundo = duas_casas(Math.floor(s % 3600) % 60);

    formatado = hora + 0 > 0 ? hora + ":" : "";
    formatado = formatado + minuto + ":" + segundo;

    return formatado;
  };