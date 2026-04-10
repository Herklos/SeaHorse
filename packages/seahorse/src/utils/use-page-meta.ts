import { useEffect } from 'react'
import { Platform } from 'react-native'

interface HreflangEntry {
  lang: string
  href: string
}

interface PageMeta {
  title: string
  description: string
  canonical?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
  hreflang?: HreflangEntry[]
}

function setMeta(nameOrProperty: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name'
  const selector = `meta[${attr}="${nameOrProperty}"]`
  let el = document.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, nameOrProperty)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Sets per-page SEO meta tags on web. No-op on native.
 * Call at the top of any web-facing page component.
 */
export function usePageMeta(meta: PageMeta) {
  useEffect(() => {
    if (Platform.OS !== 'web') return

    document.title = meta.title

    setMeta('description', meta.description)
    setMeta('og:title', meta.ogTitle ?? meta.title, true)
    setMeta('og:description', meta.ogDescription ?? meta.description, true)
    setMeta('og:type', meta.ogType ?? 'website', true)
    setMeta('twitter:title', meta.ogTitle ?? meta.title)
    setMeta('twitter:description', meta.ogDescription ?? meta.description)
    setMeta('twitter:card', meta.twitterCard ?? 'summary_large_image')

    if (meta.ogImage) {
      setMeta('og:image', meta.ogImage, true)
      setMeta('twitter:image', meta.ogImage)
    }

    if (meta.canonical) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.rel = 'canonical'
        document.head.appendChild(link)
      }
      link.href = meta.canonical
    }

    if (meta.hreflang) {
      for (const { lang, href } of meta.hreflang) {
        let link = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${lang}"]`)
        if (!link) {
          link = document.createElement('link')
          link.rel = 'alternate'
          link.setAttribute('hreflang', lang)
          document.head.appendChild(link)
        }
        link.href = href
      }
    }
  }, [
    meta.title,
    meta.description,
    meta.canonical,
    meta.ogTitle,
    meta.ogDescription,
    meta.ogImage,
    meta.ogType,
  ])
}
