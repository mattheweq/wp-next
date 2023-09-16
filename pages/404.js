import Link from 'next/Link';

export default function NotFound() {
  return (
    <>
      <div className="not-found">
        <p>404 PAGE NOT FOUND</p>
        <Link href="/">BACK</Link>
      </div>
    </>
  )
}