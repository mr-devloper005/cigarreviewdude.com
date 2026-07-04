import { siteIdentity } from '@/config/site.identity'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'

const { recipe } = getFactoryState()
const productKind = getProductKind(recipe)

/*
  Reference: hirekit-temlis.webflow.io
  Cream beige page + Instrument Serif display + deep-purple primary
  + punchy neon-green accent on near-black or purple surfaces.
*/
export const slot4BrandConfig = {
  siteName: siteIdentity.name,
  tagline: siteIdentity.tagline,
  domain: siteIdentity.domain,
  baseUrl: siteIdentity.url,
  productKind,
  ogImage: siteIdentity.ogImage,
  accents: {
    primary: '#520080',
    accent: '#c6fe01',
    surface: '#fcfaed',
  },
} as const
