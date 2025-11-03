import React, { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const CheckoutForm = ({ onSubmit, loading = false }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Contact Info
    email: "",
    phone: "",
    
    // Shipping Address
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    
    // Payment Info
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZip: ""
  });

  const [errors, setErrors] = useState({});
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";
    } else if (stepNumber === 2) {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.zipCode) newErrors.zipCode = "ZIP code is required";
    } else if (stepNumber === 3) {
      if (!formData.cardNumber) newErrors.cardNumber = "Card number is required";
      if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";
      if (!formData.cvv) newErrors.cvv = "CVV is required";
      if (!formData.nameOnCard) newErrors.nameOnCard = "Name on card is required";
      
      if (!sameAsShipping) {
        if (!formData.billingAddress) newErrors.billingAddress = "Billing address is required";
        if (!formData.billingCity) newErrors.billingCity = "Billing city is required";
        if (!formData.billingState) newErrors.billingState = "Billing state is required";
        if (!formData.billingZip) newErrors.billingZip = "Billing ZIP is required";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(3)) {
      const finalData = { ...formData };
      if (sameAsShipping) {
        finalData.billingAddress = formData.address;
        finalData.billingCity = formData.city;
        finalData.billingState = formData.state;
        finalData.billingZip = formData.zipCode;
      }
      onSubmit(finalData);
    }
  };

  const steps = [
    { number: 1, title: "Contact Info", icon: "User" },
    { number: 2, title: "Shipping", icon: "Truck" },
    { number: 3, title: "Payment", icon: "CreditCard" }
  ];

  return (
    <Card className="max-w-2xl mx-auto p-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((stepData, index) => (
          <div key={stepData.number} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all duration-200 ${
              step >= stepData.number 
                ? "bg-gradient-to-r from-primary to-blue-600 text-white" 
                : "bg-gray-200 text-gray-500"
            }`}>
              {step > stepData.number ? (
                <ApperIcon name="Check" size={20} />
              ) : (
                <ApperIcon name={stepData.icon} size={20} />
              )}
            </div>
            <div className="ml-3 hidden sm:block">
              <div className={`font-medium ${step >= stepData.number ? "text-primary" : "text-gray-500"}`}>
                {stepData.title}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${
                step > stepData.number ? "bg-primary" : "bg-gray-200"
              }`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Contact Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  error={errors.email}
                  placeholder="john@example.com"
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  error={errors.phone}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            
            <Button type="button" onClick={nextStep} variant="primary" size="lg" className="w-full">
              Continue to Shipping
              <ApperIcon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Shipping Address */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-4">
                Shipping Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  error={errors.firstName}
                />
                <Input
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  error={errors.lastName}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Address"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    error={errors.address}
                    placeholder="123 Main Street"
                  />
                </div>
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                  error={errors.city}
                />
                <Input
                  label="State"
                  value={formData.state}
                  onChange={(e) => updateFormData("state", e.target.value)}
                  error={errors.state}
                  placeholder="CA"
                />
                <Input
                  label="ZIP Code"
                  value={formData.zipCode}
                  onChange={(e) => updateFormData("zipCode", e.target.value)}
                  error={errors.zipCode}
                  placeholder="12345"
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button type="button" onClick={prevStep} variant="secondary" size="lg" className="flex-1">
                <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
                Back
              </Button>
              <Button type="button" onClick={nextStep} variant="primary" size="lg" className="flex-1">
                Continue to Payment
                <ApperIcon name="ArrowRight" size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-4">
                Payment Information
              </h3>
              <div className="space-y-4">
                <Input
                  label="Card Number"
                  value={formData.cardNumber}
                  onChange={(e) => updateFormData("cardNumber", e.target.value)}
                  error={errors.cardNumber}
                  placeholder="1234 5678 9012 3456"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry Date"
                    value={formData.expiryDate}
                    onChange={(e) => updateFormData("expiryDate", e.target.value)}
                    error={errors.expiryDate}
                    placeholder="MM/YY"
                  />
                  <Input
                    label="CVV"
                    value={formData.cvv}
                    onChange={(e) => updateFormData("cvv", e.target.value)}
                    error={errors.cvv}
                    placeholder="123"
                  />
                </div>
                <Input
                  label="Name on Card"
                  value={formData.nameOnCard}
                  onChange={(e) => updateFormData("nameOnCard", e.target.value)}
                  error={errors.nameOnCard}
                  placeholder="John Doe"
                />
                
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="sameAsShipping"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="sameAsShipping" className="text-sm text-gray-700">
                    Billing address same as shipping
                  </label>
                </div>
                
                {!sameAsShipping && (
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium text-secondary">Billing Address</h4>
                    <Input
                      label="Billing Address"
                      value={formData.billingAddress}
                      onChange={(e) => updateFormData("billingAddress", e.target.value)}
                      error={errors.billingAddress}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="City"
                        value={formData.billingCity}
                        onChange={(e) => updateFormData("billingCity", e.target.value)}
                        error={errors.billingCity}
                      />
                      <Input
                        label="State"
                        value={formData.billingState}
                        onChange={(e) => updateFormData("billingState", e.target.value)}
                        error={errors.billingState}
                      />
                    </div>
                    <Input
                      label="ZIP Code"
                      value={formData.billingZip}
                      onChange={(e) => updateFormData("billingZip", e.target.value)}
                      error={errors.billingZip}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button type="button" onClick={prevStep} variant="secondary" size="lg" className="flex-1">
                <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
                Back
              </Button>
              <Button type="submit" variant="accent" size="lg" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ApperIcon name="CreditCard" size={16} className="mr-2" />
                    Complete Order
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Card>
  );
};

export default CheckoutForm;