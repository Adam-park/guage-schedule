// 사진 설정 화면 — "편지에는 내 모습의 조각이 담겨 있다"는 온보딩 설명과 연결됨.
// 배송 완료할 때마다 조각이 맞춰지며 사진이 선명해지는 걸 블러로 표현.
// 실제 저장: localStorage. 오늘 배송 완료 개수는 지금은 데모 버튼으로 시뮬레이션.
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'toMe_userPhoto'
const MAX_BLUR_PX = 14

export default function PhotoSetupScreen() {
  const [photo, setPhoto] = useState(null)
  const [deliveredCount, setDeliveredCount] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setPhoto(saved)
  }, [])

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      setPhoto(dataUrl)
      localStorage.setItem(STORAGE_KEY, dataUrl)
      setDeliveredCount(0)
    }
    reader.readAsDataURL(file)
  }

  const blur = MAX_BLUR_PX * (1 - deliveredCount / 3)

  return (
    <div className="mx-auto flex min-h-full max-w-[440px] flex-col items-center px-6 pt-16 text-center">
      <h2 className="font-pixel text-xl text-ink">완성될 나의 모습</h2>
      <p className="mt-3 break-keep text-sm leading-relaxed text-ink-dim">
        편지 안에는 사실 이 사진의 조각이 담겨 있습니다.
        <br />
        배송을 완료할 때마다 조각이 맞춰지며 또렷해집니다.
        <br />
        나와 관련된 사진을 하나 골라보세요.
      </p>

      <label className="mt-6 flex aspect-square w-full max-w-[280px] cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-surface-sunken">
        {photo ? (
          <img
            src={photo}
            alt="조각난 나의 모습"
            className="h-full w-full object-cover transition-[filter] duration-500"
            style={{ filter: `blur(${blur}px)` }}
          />
        ) : (
          <span className="px-4 text-xs text-ink-faint">탭해서 사진 선택</span>
        )}
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </label>

      {photo && (
        <div className="mt-6 flex w-full flex-col items-center gap-2">
          <span className="text-xs text-ink-dim tabular-nums">오늘 배송 완료: {deliveredCount} / 3</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDeliveredCount((c) => Math.min(3, c + 1))}
              className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink active:scale-[.97]"
            >
              편지 배송 완료 (데모)
            </button>
            <button
              type="button"
              onClick={() => setDeliveredCount(0)}
              className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink-dim active:scale-[.97]"
            >
              초기화
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
