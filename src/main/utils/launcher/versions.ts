// import java8_0_422 from '../../../../resources/java/zulu8.80.0.17-ca-jre8.0.422-macosx_aarch64/bin/java?asset&asarUnpack'
// import java11_0_24 from '../../../../resources/java/zulu11.74.15-ca-jre11.0.24-macosx_aarch64/bin/java?asset&asarUnpack'
// import java17_0_12 from '../../../../resources/java/zulu17.52.17-ca-jre17.0.12-macosx_aarch64/bin/java?asset&asarUnpack'
// import java17_0_12win from '../../../../resources/java/zulu17.52.17-ca-jre17.0.12-win_x64/bin/java.exe?asset&asarUnpack'
// import java21_0_4 from '../../../../resources/java/zulu21.36.17-ca-jre21.0.4-macosx_aarch64/bin/java?asset&asarUnpack'
import { Version } from '@main/modules/launcher/launcher.interfaces'

// const javas = {
//   '8': java8_0_422,
//   '11': java11_0_24,
//   '17': java17_0_12,
//   '17win': java17_0_12win,
//   '21': java21_0_4
// }

export const versions: Record<string, Version> = {
  'FreshCraft Industrial DLC': {
    folder: 'FreshCraft Industrial DLC fixed',
    version: '1.19.2',
    forge: '43.3.13',
    java: '17'
    // java: javas['17']
  }
  // 'grape-industrial-dlc-mac': {
  //   folder: 'Grape Industrial DLC',
  //   version: '1.19.2',
  //   forge: '43.3.13',
  //   java: javas['17']
  // },
  // 'grape-industrial-dlc-win': {
  //   folder: 'Grape Industrial DLC',
  //   version: '1.19.2',
  //   forge: '43.3.13',
  //   java: javas['17win']
  // },
  // 'ic-steampunk-mac': {
  //   folder: 'ic-steampunk',
  //   version: '1.19.2',
  //   forge: '43.3.13',
  //   java: javas['17']
  // },
  // 'ic-steampunk-win': {
  //   folder: 'ic-steampunk',
  //   version: '1.19.2',
  //   forge: '43.3.13',
  //   java: javas['17win']
  // }
}
