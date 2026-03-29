import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }) {
    const { id } = params

    let job = null

    try {
        const apiBase = (
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
        ).replace(/\/$/, '')

        const origin = apiBase.split('/api')[0]
        const url = `${origin}/api/v1/public-recruitment/job-details/${id}`

        const res = await fetch(url, { cache: 'no-store' })
        if (res.ok) {
            const json = await res.json()
            job = json?.data ?? null
        }
    } catch {
        // fallback to defaults below
    }

    const jobTitle = job?.job_title ?? 'Open Position'
    const department = job?.department?.name ?? ''
    const location = job?.location ?? ''
    const jobType = job?.job_type ?? ''
    const company = job?.company?.name ?? 'Careers'
    const deadline = job?.deadline
        ? new Date(job.deadline).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : null

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                    position: 'relative',
                    fontFamily: 'sans-serif',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative circles */}
                <div
                    style={{
                        position: 'absolute',
                        top: -120,
                        right: -120,
                        width: 400,
                        height: 400,
                        borderRadius: '50%',
                        background: 'rgba(99,102,241,0.15)',
                        display: 'flex',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: -80,
                        left: -80,
                        width: 300,
                        height: 300,
                        borderRadius: '50%',
                        background: 'rgba(99,102,241,0.1)',
                        display: 'flex',
                    }}
                />

                {/* Content wrapper */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        padding: '60px 72px',
                    }}
                >
                    {/* Top: company label */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                        }}
                    >
                        <div
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                background: '#6366f1',
                                display: 'flex',
                            }}
                        />
                        <span
                            style={{
                                color: '#94a3b8',
                                fontSize: 22,
                                fontWeight: 500,
                                letterSpacing: 1,
                                textTransform: 'uppercase',
                            }}
                        >
                            {company}
                        </span>
                    </div>

                    {/* Middle: main content */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* Job title */}
                        <div
                            style={{
                                fontSize: jobTitle.length > 40 ? 52 : 68,
                                fontWeight: 800,
                                color: '#f1f5f9',
                                lineHeight: 1.15,
                                maxWidth: 900,
                            }}
                        >
                            {jobTitle}
                        </div>

                        {/* Tags row */}
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            {department && (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        background: 'rgba(99,102,241,0.2)',
                                        border: '1px solid rgba(99,102,241,0.4)',
                                        color: '#a5b4fc',
                                        borderRadius: 999,
                                        padding: '8px 20px',
                                        fontSize: 22,
                                        fontWeight: 600,
                                    }}
                                >
                                    {department}
                                </div>
                            )}
                            {jobType && (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        background: 'rgba(16,185,129,0.15)',
                                        border: '1px solid rgba(16,185,129,0.35)',
                                        color: '#6ee7b7',
                                        borderRadius: 999,
                                        padding: '8px 20px',
                                        fontSize: 22,
                                        fontWeight: 600,
                                    }}
                                >
                                    {jobType}
                                </div>
                            )}
                            {location && (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        background: 'rgba(251,191,36,0.12)',
                                        border: '1px solid rgba(251,191,36,0.3)',
                                        color: '#fcd34d',
                                        borderRadius: 999,
                                        padding: '8px 20px',
                                        fontSize: 22,
                                        fontWeight: 600,
                                    }}
                                >
                                    📍 {location}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom: deadline + CTA */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        {deadline ? (
                            <span style={{ color: '#64748b', fontSize: 20 }}>
                                Apply by {deadline}
                            </span>
                        ) : (
                            <span />
                        )}

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: '#6366f1',
                                color: '#fff',
                                borderRadius: 12,
                                padding: '14px 32px',
                                fontSize: 24,
                                fontWeight: 700,
                                gap: 10,
                            }}
                        >
                            Apply Now →
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
