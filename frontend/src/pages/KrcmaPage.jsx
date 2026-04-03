import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Container,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { useLocation } from 'react-router-dom'
import '../pdfWorkerSetup'
import { Document, Page } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { getLanguageFromPath } from '../utils/language'
import { getKrcmaPage } from '../api/krcma'

function formatPageTpl(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] != null ? String(vars[key]) : '',
  )
}

function MenuBookPdf({ pdfUrl, t }) {
  const theme = useTheme()
  const isSpread = useMediaQuery(theme.breakpoints.up('md'))
  const [numPages, setNumPages] = useState(null)
  const [firstVisible, setFirstVisible] = useState(1)
  const [loadFailed, setLoadFailed] = useState(false)

  const maxFirstSpread =
    numPages != null
      ? numPages % 2 === 1
        ? numPages
        : numPages - 1
      : 1

  const goPrev = useCallback(() => {
    if (!numPages) return
    if (isSpread) {
      setFirstVisible((p) => Math.max(1, p - 2))
    } else {
      setFirstVisible((p) => Math.max(1, p - 1))
    }
  }, [numPages, isSpread])

  const goNext = useCallback(() => {
    if (!numPages) return
    if (isSpread) {
      setFirstVisible((p) => Math.min(maxFirstSpread, p + 2))
    } else {
      setFirstVisible((p) => Math.min(numPages, p + 1))
    }
  }, [numPages, isSpread, maxFirstSpread])

  const onDocumentLoad = useCallback(({ numPages: n }) => {
    setNumPages(n)
    setFirstVisible(1)
    setLoadFailed(false)
  }, [])

  const pageWidth = isSpread
    ? Math.min(
        380,
        (Math.min(typeof window !== 'undefined' ? window.innerWidth : 900, 900) - 80) / 2 - 8,
      )
    : Math.min(520, (typeof window !== 'undefined' ? window.innerWidth : 400) - 48)

  const leftPage = firstVisible
  const rightPage = firstVisible + 1
  const showRight = Boolean(isSpread && numPages && rightPage <= numPages)

  const canPrev = numPages ? firstVisible > 1 : false
  const canNext = numPages
    ? isSpread
      ? firstVisible < maxFirstSpread
      : firstVisible < numPages
    : false

  let pageLabel = ''
  if (numPages) {
    if (isSpread && showRight) {
      pageLabel = formatPageTpl(t.pagesSpread, {
        from: leftPage,
        to: Math.min(rightPage, numPages),
        total: numPages,
      })
    } else {
      pageLabel = formatPageTpl(t.pagesSingle, { n: leftPage, total: numPages })
    }
  }

  if (loadFailed) {
    return (
      <Box sx={{ width: '100%' }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          {t.pdfLoadError}
        </Alert>
        <Box sx={{ width: '100%', minHeight: 480 }}>
          <Box
            component="iframe"
            title={t.menuTitle}
            src={`${pdfUrl}#view=FitH`}
            sx={{
              width: '100%',
              minHeight: 520,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
            }}
          />
        </Box>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button href={pdfUrl} target="_blank" rel="noopener noreferrer" variant="outlined">
            {t.openPdf}
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: isSpread ? 0.5 : 0,
          bgcolor: 'grey.200',
          py: 2,
          px: isSpread ? 1 : 0.5,
          borderRadius: 2,
          boxShadow: 2,
          border: 1,
          borderColor: 'divider',
          minHeight: 480,
        }}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoad}
          onLoadError={() => setLoadFailed(true)}
          loading={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400, width: '100%' }}>
              <CircularProgress />
            </Box>
          }
        >
          {numPages ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: isSpread ? 'row' : 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                gap: isSpread ? 0.5 : 0,
                maxWidth: '100%',
              }}
            >
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  borderRadius: 0.5,
                  overflow: 'hidden',
                  lineHeight: 0,
                }}
              >
                <Page pageNumber={leftPage} width={pageWidth} renderTextLayer />
              </Box>
              {showRight ? (
                <Box
                  sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    borderRadius: 0.5,
                    overflow: 'hidden',
                    lineHeight: 0,
                  }}
                >
                  <Page pageNumber={rightPage} width={pageWidth} renderTextLayer />
                </Box>
              ) : null}
            </Box>
          ) : null}
        </Document>
      </Box>

      {numPages != null && numPages > 1 ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            mt: 2,
          }}
        >
          <IconButton
            onClick={goPrev}
            disabled={!canPrev}
            aria-label={t.prev}
            sx={{
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'action.selected' },
              '&.Mui-disabled': { opacity: 0.4 },
            }}
          >
            <ChevronLeft />
          </IconButton>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: '12em', textAlign: 'center' }}>
            {pageLabel}
          </Typography>
          <IconButton
            onClick={goNext}
            disabled={!canNext}
            aria-label={t.next}
            sx={{
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'action.selected' },
              '&.Mui-disabled': { opacity: 0.4 },
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      ) : numPages === 1 ? (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          {pageLabel}
        </Typography>
      ) : null}

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button href={pdfUrl} target="_blank" rel="noopener noreferrer" variant="outlined">
          {t.openPdf}
        </Button>
      </Box>
    </Box>
  )
}

function KrcmaPage() {
  const location = useLocation()
  const { locale, lang, script } = getLanguageFromPath(location.pathname)
  const [slide, setSlide] = useState(0)

  const { data, isLoading, error } = useQuery({
    queryKey: ['krcma-page', lang, script],
    queryFn: () => getKrcmaPage(lang, script),
  })

  const content = {
    sr: {
      title: 'Крчма',
      menuTitle: 'Мени',
      openPdf: 'Отвори мени (PDF)',
      noPdf: 'Мени ће ускоро бити доступан.',
      prev: 'Претходна',
      next: 'Следећа',
      pagesSpread: 'Стране {from}–{to} од {total}',
      pagesSingle: 'Страна {n} од {total}',
      pdfLoadError: 'Учитавање PDF-а није успело. Покушајте „Отвори мени“.',
      defaultIntro:
        'Добродошли у крчму Ордо Драконис — место одмора, добре хране и дружења након посете нашем комплексу.',
    },
    'sr-latn': {
      title: 'Krčma',
      menuTitle: 'Meni',
      openPdf: 'Otvori meni (PDF)',
      noPdf: 'Meni će uskoro biti dostupan.',
      prev: 'Prethodna',
      next: 'Sledeća',
      pagesSpread: 'Strane {from}–{to} od {total}',
      pagesSingle: 'Strana {n} od {total}',
      pdfLoadError: 'Učitavanje PDF-a nije uspelo. Pokušajte „Otvori meni“.',
      defaultIntro:
        'Dobrodošli u krčmu Ordo Draconis — mesto odmora, dobre hrane i druženja nakon posete našem kompleksu.',
    },
    en: {
      title: 'The Tavern',
      menuTitle: 'Menu',
      openPdf: 'Open menu (PDF)',
      noPdf: 'The menu will be available soon.',
      prev: 'Previous',
      next: 'Next',
      pagesSpread: 'Pages {from}–{to} of {total}',
      pagesSingle: 'Page {n} of {total}',
      pdfLoadError: 'Could not load the PDF. Try “Open menu”.',
      defaultIntro:
        'Welcome to the Ordo Draconis tavern — a place to rest, enjoy food, and gather after your visit.',
    },
  }

  const t = content[locale] || content.sr
  const images = data?.galleryImages?.filter(Boolean) || []

  useEffect(() => {
    setSlide(0)
  }, [images.length])
  const intro =
    data?.description != null && String(data.description).trim() !== ''
      ? data.description
      : t.defaultIntro
  const pdfUrl = data?.menuPdfUrl?.trim() || ''

  const goPrev = () => {
    if (images.length === 0) return
    setSlide((i) => (i - 1 + images.length) % images.length)
  }
  const goNext = () => {
    if (images.length === 0) return
    setSlide((i) => (i + 1) % images.length)
  }

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h2" align="center" sx={{ mb: 3 }}>
          {t.title}
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{ mb: 6, maxWidth: '720px', mx: 'auto', whiteSpace: 'pre-wrap' }}
        >
          {intro}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error.message}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : images.length > 0 ? (
          <Box sx={{ mb: 8 }}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: 'action.hover',
                maxHeight: 480,
              }}
            >
              <Box
                component="img"
                src={images[slide]}
                alt=""
                sx={{
                  width: '100%',
                  height: '100%',
                  maxHeight: 480,
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {images.length > 1 && (
                <>
                  <IconButton
                    onClick={goPrev}
                    aria-label={t.prev}
                    sx={{
                      position: 'absolute',
                      left: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(0,0,0,0.45)',
                      color: 'common.white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
                    }}
                  >
                    <ChevronLeft />
                  </IconButton>
                  <IconButton
                    onClick={goNext}
                    aria-label={t.next}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(0,0,0,0.45)',
                      color: 'common.white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
                    }}
                  >
                    <ChevronRight />
                  </IconButton>
                </>
              )}
            </Box>
            {images.length > 1 && (
              <Typography align="center" variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {slide + 1} / {images.length}
              </Typography>
            )}
          </Box>
        ) : null}

        <Typography variant="h4" align="center" sx={{ mb: 3 }}>
          {t.menuTitle}
        </Typography>
        {pdfUrl ? (
          <MenuBookPdf pdfUrl={pdfUrl} t={t} />
        ) : (
          <Typography align="center" color="text.secondary">
            {t.noPdf}
          </Typography>
        )}
      </Container>
    </Box>
  )
}

export default KrcmaPage
