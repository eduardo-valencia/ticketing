import React from 'react'
import Link from 'next/link'

export default function Header({ currentUser }) {
  const links = [
    !currentUser && {
      label: 'Sign Up',
      href: '/auth/signup',
    },
    !currentUser && {
      label: 'Sign In',
      href: '/auth/signin',
    },
    currentUser && {
      label: 'Sell Tickets',
      href: '/tickets/new',
    },
    currentUser && {
      label: 'Orders',
      href: '/orders/',
    },
    currentUser && {
      label: 'Sign Out',
      href: '/auth/signout',
    },
  ]

  const renderedLinks = links
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => (
      <li key={href} className="nav-item">
        <Link href={href}>
          <a href={href}>{label}</a>
        </Link>
      </li>
    ))
  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{renderedLinks}</ul>
      </div>
    </nav>
  )
}
