import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Send, User, Phone, BookOpen, Loader2 } from 'lucide-react';
import { submitToFormSubmit } from '@/lib/formsubmit';

interface CourseEnquiryFormProps {
  defaultCourse?: string;
}

const CourseEnquiryForm = ({ defaultCourse }: CourseEnquiryFormProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState(defaultCourse || '');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !course) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast({ title: 'Please enter a valid 10-digit phone number', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await submitToFormSubmit({
        formType: 'Course Enquiry',
        Name: name.trim(),
        Phone: phone.trim(),
        Course: course,
      });
      toast({ title: 'Enquiry submitted!', description: 'Redirecting…' });
      setName('');
      setPhone('');
      if (!defaultCourse) setCourse('');
      navigate('/thank-you', { state: { formType: 'your course enquiry' } });
    } catch {
      toast({ title: 'Something went wrong', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto border-0 shadow-xl overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-primary" />
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="eq-name" className="text-sm font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Full Name
            </Label>
            <Input
              id="eq-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your full name"
              maxLength={100}
              className="h-12 text-base"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eq-phone" className="text-sm font-semibold flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" /> Phone Number
            </Label>
            <Input
              id="eq-phone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
              className="h-12 text-base"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eq-course" className="text-sm font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" /> Course / Class
            </Label>
            <Select value={course} onValueChange={setCourse} disabled={loading}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Class 6-8">Class 6–8</SelectItem>
                <SelectItem value="Class 9">Class 9</SelectItem>
                <SelectItem value="Class 10">Class 10</SelectItem>
                <SelectItem value="Class 11">Class 11</SelectItem>
                <SelectItem value="Class 12">Class 12</SelectItem>
                <SelectItem value="IIT-JEE">IIT-JEE</SelectItem>
                <SelectItem value="NEET">NEET</SelectItem>
                <SelectItem value="NDA">NDA</SelectItem>
                <SelectItem value="CUET">CUET</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-12 text-base rounded-xl" disabled={loading}>
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting…</>
            ) : (
              <><Send className="w-4 h-4 mr-2" /> Submit Enquiry</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CourseEnquiryForm;
