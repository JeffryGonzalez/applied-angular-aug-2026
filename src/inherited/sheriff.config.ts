import { sameTag, SheriffConfig } from '@softarc/sheriff-core';

export const config: SheriffConfig = {
  enableBarrelLess: true,

  modules: {
    'src/app/areas/shared/<type>-<name>': ['shared', 'type:<type>'],
    'src/app/areas/<area>/<type>-<name>': ['area:<area>', 'type:<type>'],
  },

  depRules: {
    root: ['*'],
    'area:*': [sameTag, 'shared'],
    'type:feature': ['type:data', 'type:ui', 'type:util', 'type:feature', 'shared'],
    'type:data': ['type:data', 'type:util', 'shared'],
    'type:ui': ['type:ui', 'type:util', 'shared'],
    'type:util': ['type:util', 'shared'],
    shared: ['shared'],
  },
};