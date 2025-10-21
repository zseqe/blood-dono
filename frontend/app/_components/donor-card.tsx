// frontend/app/_components/donor-card.tsx
'use client';
import { useState } from 'react';
import { Donor, RankedDonor, MatchExplanation } from '@/lib/definitions';
import { BloodType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
// --- CORRECTED IMPORT PATH ---
import { useToast } from "@/hooks/use-toast";
// --- END CORRECTION ---
import { MapPin, Info, PhoneForwarded, Star, Activity, ZapOff, TrendingUp, TrendingDown, CheckCircle2, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

function getReliabilityColor(score: number): string { /* ... */ if (score >= 0.9) return "text-green-600 dark:text-green-400"; if (score >= 0.7) return "text-yellow-600 dark:text-yellow-400"; return "text-brand-red dark:text-red-500"; }
const prepareChartData = (shapData: MatchExplanation[] = []) => { /* ... */ return shapData .filter(item => Math.abs(item.impact) > 0.01) .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact)) .map(item => ({ name: item.feature, impact: item.impact, value: item.value, })); };
const getImpactColor = (impact: number) => impact >= 0 ? '#10B981' : '#F87171';
const RenderImpactIcon = (props: any) => { /* ... */ const { x, y, width, value } = props; const iconSize = 10; const iconX = x + width + 5; const iconY = y - iconSize / 2 + 6; if (value > 0) { return <TrendingUp x={iconX} y={iconY} size={iconSize} className="text-green-600" />; } else if (value < 0) { return <TrendingDown x={iconX} y={iconY} size={iconSize} className="text-red-500" />; } return null; };
const CustomTooltip = ({ active, payload, label }: any) => { /* ... */ if (active && payload && payload.length) { const data = payload[0].payload; let valueDisplay = data.value.toFixed(2); if (label === 'Reliability') valueDisplay = `${(data.value * 100).toFixed(0)}%`; if (label === 'Location') valueDisplay = data.value === 1 ? 'Local' : 'Not Local'; return ( <div className="bg-card p-2 border border-border rounded shadow-lg text-xs"> <p className="font-bold text-foreground">{label}</p> <p className={`font-semibold ${data.impact >= 0 ? 'text-green-600' : 'text-red-500'}`}> {`Impact: ${data.impact > 0 ? '+' : ''}${data.impact.toFixed(3)}`} </p> <p className="text-muted-foreground">{`Value: ${valueDisplay}`}</p> </div> ); } return null; };

export function DonorCard({ match }: { match: RankedDonor }) {
  const [showXai, setShowXai] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const handleContact = async () => { /* ... */ setIsSubmitting(true); try { await new Promise(resolve => setTimeout(resolve, 1000)); toast({ title: "Notification Sent!", description: `${match.donor.full_name} notified (simulated).`, }); } catch (err) { toast({ title: "Error", description: "Could not send notification.", variant: "destructive" }); } finally { setIsSubmitting(false); } };
  const chartData = showXai ? prepareChartData(match.explanation_shap) : [];
  const reliabilityColor = getReliabilityColor(match.donor.reliability_score);

  return (
    <Card className="flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow border rounded-lg overflow-hidden bg-card">
      <CardHeader className="bg-gradient-to-r from-sky-50 to-teal-50 dark:from-sky-900/30 dark:to-teal-900/30 p-4 border-b">
         {/* ... Header ... */}
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {/* ... Donor Info ... */}
        {/* ... AI Insight ... */}
      </CardContent>
      <CardFooter className="p-3 bg-muted/30 border-t">
        <Dialog>
           <DialogTrigger asChild>
             <Button className="w-full bg-brand-sky hover:bg-brand-sky/90 text-white font-semibold rounded-md shadow hover:shadow-md transition" size="sm">
                 <PhoneForwarded className="h-4 w-4 mr-2" /> Request Contact
             </Button>
           </DialogTrigger>
          <DialogContent> <DialogHeader> <DialogTitle>Confirm Contact Request</DialogTitle> <DialogDescription> Send secure notification to {match.donor.full_name}? </DialogDescription> </DialogHeader> <DialogFooter> <Button onClick={handleContact} disabled={isSubmitting} className="bg-brand-red hover:bg-brand-darkred text-white"> {isSubmitting ? "Sending..." : "Confirm & Send"} </Button> </DialogFooter> </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}