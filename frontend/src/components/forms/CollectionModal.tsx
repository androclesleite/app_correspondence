import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { packagesApi } from '../../services/api';
import type { Package } from '../../types';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: Package | null;
  onSuccess: () => void;
}

export default function CollectionModal({ isOpen, onClose, package: pkg, onSuccess }: CollectionModalProps) {
  const [step, setStep] = useState(1); // 1: Dados, 2: Foto, 3: Assinatura
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    collector_name: '',
    collector_cpf: '',
  });

  const [photo, setPhoto] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const webcamRef = useRef<Webcam>(null);
  const signatureRef = useRef<SignatureCanvas>(null);

  const resetForm = () => {
    setStep(1);
    setFormData({ collector_name: '', collector_cpf: '' });
    setPhoto(null);
    setSignature(null);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/\D/g, '');
    return cleanCPF.length === 11;
  };

  const formatCPF = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.slice(0, 11);
  };

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setPhoto(imageSrc);
      setStep(3);
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    setStep(2);
  };

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const saveSignature = () => {
    if (signatureRef.current) {
      const signatureData = signatureRef.current.toDataURL();
      setSignature(signatureData);
    }
  };

  const handleSubmit = async () => {
    if (!pkg || !photo || !signature) return;

    setIsLoading(true);
    setError('');

    try {
      // Convert base64 photo to file
      const photoBlob = await fetch(photo).then(r => r.blob());
      const photoFile = new File([photoBlob], 'photo.jpg', { type: 'image/jpeg' });

      const formDataSubmit = new FormData();
      formDataSubmit.append('collector_name', formData.collector_name);
      formDataSubmit.append('collector_cpf', formData.collector_cpf);
      formDataSubmit.append('photo', photoFile);
      formDataSubmit.append('signature', signature);

      await packagesApi.collect(pkg.id, formDataSubmit);

      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao confirmar retirada');
    } finally {
      setIsLoading(false);
    }
  };

  const canProceedStep1 = formData.collector_name && validateCPF(formData.collector_cpf);
  const canProceedStep3 = signature !== null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Confirmar Retirada - {pkg?.code}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Step Indicator */}
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <div className={`flex-1 h-1 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <div className={`flex-1 h-1 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
            3
          </div>
        </div>

        {/* Step 1: Dados pessoais */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Dados do Responsável pela Retirada</h4>

            <div>
              <label htmlFor="collector_name" className="block text-sm font-medium text-gray-700">
                Nome Completo *
              </label>
              <Input
                id="collector_name"
                type="text"
                value={formData.collector_name}
                onChange={(e) => setFormData(prev => ({ ...prev, collector_name: e.target.value }))}
                placeholder="Digite o nome completo"
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="collector_cpf" className="block text-sm font-medium text-gray-700">
                CPF *
              </label>
              <Input
                id="collector_cpf"
                type="text"
                value={formData.collector_cpf}
                onChange={(e) => setFormData(prev => ({ ...prev, collector_cpf: formatCPF(e.target.value) }))}
                placeholder="Digite apenas números"
                maxLength={11}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Digite apenas os números do CPF</p>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className="bg-primary hover:bg-primary/90"
              >
                Próximo: Foto
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Captura de foto */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Capturar Foto</h4>

            {!photo ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={400}
                    height={300}
                    className="rounded-lg border"
                  />
                </div>
                <div className="flex justify-center">
                  <Button
                    onClick={capturePhoto}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Capturar Foto
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src={photo}
                    alt="Foto capturada"
                    className="rounded-lg border max-w-sm"
                  />
                </div>
                <div className="flex justify-center space-x-3">
                  <Button variant="outline" onClick={retakePhoto}>
                    Tirar Nova Foto
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Próximo: Assinatura
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-start">
              <Button variant="outline" onClick={() => setStep(1)}>
                Voltar
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Assinatura */}
        {step === 3 && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Assinatura Digital</h4>

            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">
                Assine no espaço abaixo usando o mouse ou toque na tela:
              </p>
              <div className="border bg-white rounded">
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{
                    width: 500,
                    height: 200,
                    className: 'signature-canvas w-full',
                  }}
                  onEnd={saveSignature}
                />
              </div>
              <div className="flex justify-between mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSignature}
                >
                  Limpar Assinatura
                </Button>
                <span className="text-xs text-gray-500">
                  {signature ? '✓ Assinatura salva' : 'Assine acima'}
                </span>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Voltar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!canProceedStep3 || isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Confirmando...' : 'Confirmar Retirada'}
              </Button>
            </div>
          </div>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
}