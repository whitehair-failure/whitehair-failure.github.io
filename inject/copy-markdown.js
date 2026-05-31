(() => {
  const SOURCE_ID = 'post-markdown-source'
  const MENU_ITEM_ID = 'menu-copyMarkdown'
  const BUTTON_WRAPPER_ID = 'copy-post-markdown-action'

  const normalizeLineBreaks = value => value.replace(/\r\n?/g, '\n')

  const decodeBase64Unicode = value => {
    if (!value) return ''

    const binary = window.atob(value)
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))

    if (typeof TextDecoder === 'function') {
      return new TextDecoder().decode(bytes)
    }

    let escaped = ''
    bytes.forEach(byte => {
      escaped += `%${byte.toString(16).padStart(2, '0')}`
    })
    return decodeURIComponent(escaped)
  }

  const stripFrontMatter = source => {
    const normalized = normalizeLineBreaks(source)
    const stripped = normalized.replace(/^---\n[\s\S]*?\n(?:---|\.\.\.)\n?/, '')
    return stripped.trim()
  }

  const getPostMarkdown = () => {
    const sourceNode = document.getElementById(SOURCE_ID)

    if (!sourceNode) return ''

    try {
      return stripFrontMatter(decodeBase64Unicode(sourceNode.dataset.raw || ''))
    } catch (error) {
      console.error('Failed to decode post markdown source.', error)
      return ''
    }
  }

  const showMessage = (message, isError = false) => {
    if (window.btf && typeof window.btf.snackbarShow === 'function') {
      window.btf.snackbarShow(message, false, 2000)
      return
    }

    const method = isError ? 'error' : 'log'
    console[method](message)
  }

  const copyText = async text => {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text)
      return
    }

    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', 'readonly')
    textarea.style.position = 'fixed'
    textarea.style.top = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    textarea.remove()
  }

  const hideRightMenu = () => {
    const rightMenu = document.getElementById('rightMenu')
    const rightMenuMask = document.getElementById('rightMenu-mask')

    if (rightMenu) {
      rightMenu.style.display = 'none'
    }

    if (rightMenuMask) {
      rightMenuMask.style.display = 'none'
    }
  }

  const handleCopyMarkdown = async () => {
    const markdown = getPostMarkdown()

    if (!markdown) {
      showMessage('当前文章没有可复制的 Markdown 正文', true)
      hideRightMenu()
      return
    }

    try {
      await copyText(markdown)
      showMessage('已复制本文 Markdown 正文')
    } catch (error) {
      console.error('Failed to copy post markdown.', error)
      showMessage('复制失败，请检查浏览器剪贴板权限', true)
    }

    hideRightMenu()
  }

  const ensureCopyButton = hasMarkdown => {
    const tagShare = document.querySelector('#post .tag_share')

    if (!tagShare) return

    const existingWrapper = document.getElementById(BUTTON_WRAPPER_ID)

    if (!hasMarkdown) {
      existingWrapper && existingWrapper.remove()
      return
    }

    if (existingWrapper) return

    const wrapper = document.createElement('div')
    wrapper.id = BUTTON_WRAPPER_ID
    wrapper.className = 'post-share'
    wrapper.style.margin = '8px 12px 0 0'

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'copy-post-markdown-button'
    button.innerHTML = '<i class="fa-brands fa-markdown" aria-hidden="true"></i><span>复制为Markdown</span>'
    button.style.display = 'inline-flex'
    button.style.alignItems = 'center'
    button.style.gap = '6px'
    button.style.padding = '6px 12px'
    button.style.border = '1px solid var(--light-grey)'
    button.style.borderRadius = '999px'
    button.style.background = 'var(--card-bg)'
    button.style.color = 'var(--font-color)'
    button.style.cursor = 'pointer'
    button.style.fontSize = '.85em'
    button.addEventListener('click', handleCopyMarkdown)

    wrapper.appendChild(button)

    const shareActions = tagShare.querySelector('.post-share')
    if (shareActions) {
      tagShare.insertBefore(wrapper, shareActions)
      return
    }

    tagShare.appendChild(wrapper)
  }

  const bindRightMenuItem = hasMarkdown => {
    const menuItem = document.getElementById(MENU_ITEM_ID)

    if (!menuItem) return

    menuItem.style.display = hasMarkdown ? '' : 'none'

    if (!hasMarkdown || menuItem.dataset.markdownBound === 'true') return

    menuItem.dataset.markdownBound = 'true'
    menuItem.addEventListener('click', handleCopyMarkdown)
  }

  const initCopyMarkdown = () => {
    const hasMarkdown = Boolean(getPostMarkdown())
    ensureCopyButton(hasMarkdown)
    bindRightMenuItem(hasMarkdown)
  }

  document.addEventListener('DOMContentLoaded', initCopyMarkdown)
  document.addEventListener('pjax:success', initCopyMarkdown)
})()