from django import forms


class SiteForm(forms.Form):
    site_status = (
        (1, "正常"),
        (2, "异常"),
        (0, "离线")
    )
    siteName = forms.CharField(max_length=32, label='站点名称')
    pH = forms.CharField(max_length=32, label='PH值')
    NTU = forms.CharField(max_length=32, label='浑浊度')
    oxygen = forms.CharField(max_length=32, label='溶解氧')
    tem = forms.CharField(max_length=32, label='水温')
    ele = forms.CharField(max_length=32, label='电导率')
    chlorine = forms.CharField(max_length=32, label='余氯')
    status = forms.fields.ChoiceField(choices=site_status, label='站点状态')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].widget.attrs.update({
                'class': 'form-control',
            })
