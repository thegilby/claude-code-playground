import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'

export default function Home() {
  return (
    <>
      <Head>
        <title>My React App</title>
        <meta name="description" content="Web site created using Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className={styles.app}>
        <header className={styles.header}>
          <Image
            src="/logo.svg"
            alt="React logo"
            className={styles.logo}
            width={200}
            height={200}
            priority
            sizes="(max-width: 768px) 100vw, 200px"
          />
          <p>
            Edit <code>pages/index.tsx</code> and save to reload.
          </p>
          <a
            className={styles.link}
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn Next.js
          </a>
        </header>
      </div>
    </>
  )
}