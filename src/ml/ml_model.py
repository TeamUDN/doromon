import torch
import torch.nn as nn
import torchvision

class Flatten(nn.Module):
    def forward(self, input):
        #return input.view(input.size(0), -1)
        return input.reshape(input.size(0), -1)


class UnFlatten(nn.Module):
    def forward(self, input, size=1):#256
        #return input.view(input.size(0), size, 4,4)
        return input.reshape(input.size(0), size, 28,28)



class ResNet(nn.Module):
    '''
    torchvisionのresnetの中身を見てみると、conv1あたりの前処理の後に、特徴量抽出部分がありlayer1～4が該当します。ここの中間出力をバックボーンの出力として使います。
    　出力は4つのtensorで、それぞれ画像の大きさがwidth, heightが1/4, 1/8, 1/16, 1/32になっています。
    　また、resnet_typeによってスケール可能にしてあります。
    　出力チャンネル数はモデルのスケールによって違っており、以下の通りです。
​
    resnet18, 34は[64, 128, 256, 512] (左からout1,out2,out3,out4)
    50以上は[256, 512, 1024, 2048]
    https://deecode.net/?p=1226

    '''
    def __init__(self,num_classes, resnet_type="resnet50", pretrained=True):
        super().__init__()

        self.resnet_model = torchvision.models.resnet152(pretrained=pretrained)
        self.Unflat=UnFlatten()
        self.flat=Flatten()

        self.conv1 = nn.Conv2d(1, 64, kernel_size=(7, 7), stride=(2, 2), padding=(3, 3), bias=False)
        self.fc1 = nn.Linear(2048, num_classes)
    def forward(self, x):
        x = self.Unflat(x)
        #x = self.resnet_model.conv1(x)
        x = self.conv1(x)
        x = self.resnet_model.bn1(x)
        x = self.resnet_model.relu(x)
        x = self.resnet_model.maxpool(x)
        out1 = self.resnet_model.layer1(x)  # width, heightは1/4
        out2 = self.resnet_model.layer2(out1)  # width, heightは1/8
        out3 = self.resnet_model.layer3(out2)  # width, heightは1/16
        out4 = self.resnet_model.layer4(out3)  # width, heightは1/32
        x = self.flat(out4)
        #print(x.size())
        x = self.fc1(x)

        return x