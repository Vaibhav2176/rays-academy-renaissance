import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useClasses } from '@/hooks/useClasses';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  classId: string;
  dateOfBirth: string;
  gender: string;
  parentName: string;
  parentPhone: string;
  schoolName: string;
  board: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const RegisterForm = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { data: classes } = useClasses();
  const { toast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    classId: '',
    dateOfBirth: '',
    gender: '',
    parentName: '',
    parentPhone: '',
    schoolName: '',
    board: 'CBSE',
    address: '',
    city: '',
    state: 'Madhya Pradesh',
    pincode: '',
  });

  const updateField = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      toast({ title: "Required", description: "Please enter your full name.", variant: "destructive" });
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast({ title: "Required", description: "Please enter a valid email.", variant: "destructive" });
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      toast({ title: "Required", description: "Please enter a valid phone number.", variant: "destructive" });
      return false;
    }
    if (!formData.dateOfBirth) {
      toast({ title: "Required", description: "Please enter your date of birth.", variant: "destructive" });
      return false;
    }
    if (!formData.gender) {
      toast({ title: "Required", description: "Please select your gender.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.classId) {
      toast({ title: "Required", description: "Please select your class.", variant: "destructive" });
      return false;
    }
    if (!formData.schoolName.trim()) {
      toast({ title: "Required", description: "Please enter your school name.", variant: "destructive" });
      return false;
    }
    if (!formData.parentName.trim()) {
      toast({ title: "Required", description: "Please enter parent/guardian name.", variant: "destructive" });
      return false;
    }
    if (!formData.parentPhone.trim() || formData.parentPhone.length < 10) {
      toast({ title: "Required", description: "Please enter parent's phone number.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    
    if (formData.password.length < 6) {
      toast({ title: "Weak Password", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    
    const { error } = await signUp(formData.email, formData.password, {
      fullName: formData.fullName,
      phone: formData.phone,
      classId: formData.classId,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      parentName: formData.parentName,
      parentPhone: formData.parentPhone,
      schoolName: formData.schoolName,
      board: formData.board,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
    });
    
    if (error) {
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome to Rays Academy!", description: "Your account has been created. Check your email for verification." });
      navigate('/portal');
    }
    
    setLoading(false);
  };

  const boards = ['CBSE', 'ICSE', 'MP Board', 'Other'];
  const states = ['Madhya Pradesh', 'Uttar Pradesh', 'Rajasthan', 'Maharashtra', 'Gujarat', 'Other'];

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {s}
            </div>
            {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Personal Details */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center mb-4">Personal Details</p>
          
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="Enter student's full name"
              value={formData.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateField('dateOfBirth', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(v) => updateField('gender', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="student@example.com"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Student's Phone *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              required
            />
          </div>
          
          <Button type="button" className="w-full" onClick={handleNextStep}>
            Next: Academic Details
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step 2: Academic & Parent Details */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center mb-4">Academic & Parent Details</p>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="classId">Class *</Label>
              <Select value={formData.classId} onValueChange={(v) => updateField('classId', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes?.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="board">Board *</Label>
              <Select value={formData.board} onValueChange={(v) => updateField('board', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select board" />
                </SelectTrigger>
                <SelectContent>
                  {boards.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="schoolName">School Name *</Label>
            <Input
              id="schoolName"
              placeholder="Enter your school name"
              value={formData.schoolName}
              onChange={(e) => updateField('schoolName', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="parentName">Parent/Guardian Name *</Label>
            <Input
              id="parentName"
              placeholder="Enter parent's full name"
              value={formData.parentName}
              onChange={(e) => updateField('parentName', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="parentPhone">Parent's Phone *</Label>
            <Input
              id="parentPhone"
              type="tel"
              placeholder="+91 9876543210"
              value={formData.parentPhone}
              onChange={(e) => updateField('parentPhone', e.target.value)}
              required
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button type="button" className="flex-1" onClick={handleNextStep}>
              Next: Address & Password
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Address & Password */}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center mb-4">Address & Password</p>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Street address (optional)"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="City"
                value={formData.city}
                onChange={(e) => updateField('city', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={(e) => updateField('pincode', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select value={formData.state} onValueChange={(v) => updateField('state', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password (min. 6 characters)"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              required
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default RegisterForm;
