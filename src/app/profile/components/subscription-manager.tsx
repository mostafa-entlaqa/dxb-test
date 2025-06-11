'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { format } from 'date-fns'
import { CalendarDays, CreditCard, AlertCircle } from 'lucide-react'

type Subscription = {
    id: number
    stripe_subscription_id: string
    status: 'active' | 'canceled' | 'past_due' | 'unpaid'
    current_period_start: string
    current_period_end: string
    cancel_at_period_end: boolean
    created_at: string
    updated_at: string
}

export default function SubscriptionManager() {
    const [subscription, setSubscription] = useState<Subscription | null>(null)
    const [loading, setLoading] = useState(true)
    const [canceling, setCanceling] = useState(false)
    const { toast } = useToast()
    const supabase = createClientComponentClient()

    useEffect(() => {
        fetchSubscription()
    }, [])

    const fetchSubscription = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', session.user.id)
                .eq('status', 'active')
                .single()

            if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
                throw error
            }

            setSubscription(data)
        } catch (error) {
            console.error('Error fetching subscription:', error)
            toast({
                title: 'Error',
                description: 'Failed to load subscription details',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCancelSubscription = async () => {
        if (!subscription) return

        setCanceling(true)
        try {
            const response = await fetch('/api/business/subscription/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscriptionId: subscription.stripe_subscription_id
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to cancel subscription')
            }

            await fetchSubscription() // Refresh subscription status
            toast({
                title: 'Success',
                description: 'Your subscription will be canceled at the end of the billing period',
            })
        } catch (error) {
            console.error('Error canceling subscription:', error)
            toast({
                title: 'Error',
                description: 'Failed to cancel subscription',
                variant: 'destructive'
            })
        } finally {
            setCanceling(false)
        }
    }

    const handleResumeSubscription = async () => {
        if (!subscription) return

        try {
            const response = await fetch('/api/business/subscription/resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscriptionId: subscription.stripe_subscription_id
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to resume subscription')
            }

            await fetchSubscription() // Refresh subscription status
            toast({
                title: 'Success',
                description: 'Your subscription has been resumed',
            })
        } catch (error) {
            console.error('Error resuming subscription:', error)
            toast({
                title: 'Error',
                description: 'Failed to resume subscription',
                variant: 'destructive'
            })
        }
    }

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Subscription</CardTitle>
                    <CardDescription>Loading subscription details...</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    if (!subscription) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Subscription</CardTitle>
                    <CardDescription>You don't have an active subscription</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        onClick={() => window.location.href = '/buy'}
                        className="w-full"
                    >
                        Subscribe Now
                    </Button>
                </CardContent>
            </Card>
        )
    }

    const statusColors = {
        active: 'bg-green-500',
        canceled: 'bg-red-500',
        past_due: 'bg-amber-500',
        unpaid: 'bg-red-500'
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Subscription</CardTitle>
                        <CardDescription>Manage your subscription</CardDescription>
                    </div>
                    <Badge
                        variant="default"
                        className={statusColors[subscription.status]}
                    >
                        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div className="space-y-0.5">
                            <p className="text-sm font-medium">Current Period</p>
                            <p className="text-xs text-muted-foreground">
                                {format(new Date(subscription.current_period_start), 'MMM d, yyyy')} - {format(new Date(subscription.current_period_end), 'MMM d, yyyy')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div className="space-y-0.5">
                            <p className="text-sm font-medium">Plan</p>
                            <p className="text-xs text-muted-foreground">Business Subscription (AED 1,499/month)</p>
                        </div>
                    </div>

                    {subscription.cancel_at_period_end && (
                        <div className="flex items-center text-amber-500 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            <p className="text-sm">
                                Your subscription will end on {format(new Date(subscription.current_period_end), 'MMM d, yyyy')}
                            </p>
                        </div>
                    )}

                    <div className="pt-4">
                        {subscription.cancel_at_period_end ? (
                            <Button
                                onClick={handleResumeSubscription}
                                className="w-full"
                                variant="outline"
                            >
                                Resume Subscription
                            </Button>
                        ) : (
                            <Button
                                onClick={handleCancelSubscription}
                                className="w-full"
                                variant="destructive"
                                disabled={canceling}
                            >
                                {canceling ? 'Canceling...' : 'Cancel Subscription'}
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 