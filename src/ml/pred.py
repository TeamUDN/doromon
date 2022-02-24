
def pred(img):
    import torch
    import torch.nn as nn


    import numpy as np
    from PIL import Image
    from ml.ml_model import ResNet


    classes=['airplane', 'angel', 'dog', 'dolphin', 'shark', 'skull', 'snowman', 'submarine', 
    'teddy-bear', 'The Eiffel Tower', 'The Mona Lisa', 'tiger', 'tornado', 'umbrella', 'washing machine', 'zebra']


    #モデルの読み込み

    #device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    device = 'cpu'

    model_path = '/projects/ml/cls_model.torch'
    model = ResNet(num_classes=16).to(device)
    model.load_state_dict(torch.load(model_path, map_location=torch.device(device)))
    model.eval()


    m = nn.Softmax(dim=1)


    image = img
                
    image = image.resize((28, 28))
    data = np.asarray(image)
    data=data-255


    t = torch.from_numpy(data.astype(np.float32)).clone()
    out = model(t.unsqueeze(0).to(device))

    out=m(out)

    re=[]
    pr=[]
    for l in out.argsort().tolist()[0][::-1][:3]:
        print(classes[l])
        print(out[0][l].item()*100)
        #re.append(classes[l])
        re.append(l)
        pr.append(int(out[0][l].item()*100))
    
    #pr.append(int(100-sum(pr)))


    return re,pr