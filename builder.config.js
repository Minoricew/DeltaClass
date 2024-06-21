const windowsOS = {
  win: {
    icon: 'assets/app_icon.ico',
    publisherName: 'DeltaApps',
    target: 'nsis'
  },

  nsis: {
    differentialPackage: true,
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createStartMenuShortcut: true,
    allowElevation: true,
    perMachine: false
  }
}

const linuxOS = {
  linux: {
    icon: 'assets/app_icon.ico',
    target: 'deb'
  }
}

const macOS = {
  mac: {
    target: 'dmg',
    icon: 'assets/app_icon.ico'
  },
  dmg: {
    contents: [
      {
        x: 410,
        y: 150,
        type: 'link',
        path: '/Applications'
      },
      {
        x: 130,
        y: 150,
        type: 'file'
      }
    ]
  }
}

module.exports = {
  productName: 'DeltaClass',
  appId: 'app.deltax.class',
  artifactName: 'DeltaClass-Setup.${ext}',
  directories: {
    output: 'build'
  },
  // default files: https://www.electron.build/configuration/contents
  files: [
    'package.json',
    {
      from: 'dist/main/',
      to: 'dist/main/'
    },
    {
      from: 'dist/renderer',
      to: 'dist/renderer/'
    }
  ],
  extraResources: [
    {
      from: 'src/extraResources/',
      to: ''
    }
  ],
  target: [{
    target: 'nsis',
    arch: [
      'x64'
    ]
  }],
  ...windowsOS,
  ...linuxOS,
  ...macOS
}
