import PackageForm from '../../components/forms/PackageForm'

export function NewCorrespondence() {
  return (
    <PackageForm onSuccess={() => window.location.href = '/correspondence'} />
  )
}