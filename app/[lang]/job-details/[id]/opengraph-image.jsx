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
            job = json?.data?.job_list ?? json?.data ?? json
        }
    } catch {
        // fallback
    }

    const jobTitle = job?.job_title ?? 'Open Position'
    const departmentName = job?.department?.name ?? 'Recruitment'
    const locationName = job?.location ?? 'Worldwide'
    const jobTypeName = job?.job_type ?? 'Full-time'
    const companyName = job?.company?.name ?? 'Matendes HRM'

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    backgroundImage: `
                        radial-gradient(circle at 0% 0%, #4f46e5 0%, transparent 50%),
                        radial-gradient(circle at 100% 0%, #c026d3 0%, transparent 50%),
                        radial-gradient(circle at 100% 100%, #db2777 0%, transparent 50%),
                        radial-gradient(circle at 0% 100%, #7c3aed 0%, transparent 50%),
                        radial-gradient(circle at 50% 50%, #4338ca 0%, transparent 100%)
                    `,
                    padding: '40px',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Main Glass Card */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '48px',
                        padding: '64px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Top Bar */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                        }}
                    >
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: 'linear-gradient(to bottom right, #fff, rgba(255,255,255,0.5))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '4px solid #4f46e5' }} />
                        </div>
                        <span
                            style={{
                                color: '#fff',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                            }}
                        >
                            {companyName}
                        </span>
                    </div>

                    {/* Middle Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '20px',
                                fontWeight: '600',
                            }}
                        >
                            <span>WE ARE HIRING</span>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.3)', marginLeft: '12px' }} />
                        </div>
                        <h1
                            style={{
                                margin: 0,
                                padding: 0,
                                fontSize: jobTitle.length > 30 ? '72px' : '96px',
                                fontWeight: '900',
                                color: '#fff',
                                lineHeight: '1',
                                letterSpacing: '-3px',
                                textShadow: '0 10px 30px rgba(0,0,0,0.2)',
                            }}
                        >
                            {jobTitle}
                        </h1>

                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
                            <div
                                style={{
                                    backgroundColor: '#fff',
                                    color: '#4f46e5',
                                    borderRadius: '100px',
                                    padding: '10px 24px',
                                    fontSize: '22px',
                                    fontWeight: 'bold',
                                }}
                            >
                                {departmentName}
                            </div>
                            <div
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    color: '#fff',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '100px',
                                    padding: '10px 24px',
                                    fontSize: '22px',
                                    fontWeight: 'bold',
                                }}
                            >
                                {jobTypeName}
                            </div>
                            <div
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    color: '#fff',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '100px',
                                    padding: '10px 24px',
                                    fontSize: '22px',
                                    fontWeight: 'bold',
                                }}
                            >
                                📍 {locationName}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '18px', fontWeight: 'bold' }}>
                                APPLY ONLINE AT
                            </div>
                            <div style={{ color: '#fff', fontSize: '28px', fontWeight: '900' }}>
                                careers.matendes.com
                            </div>
                        </div>

                        <div
                            style={{
                                backgroundColor: '#fff',
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                            }}
                        >
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#4f46e5"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>

                    {/* Decorative Blobs in corner of card */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '-50px',
                            right: '-50px',
                            width: '200px',
                            height: '200px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                        }}
                    />
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
