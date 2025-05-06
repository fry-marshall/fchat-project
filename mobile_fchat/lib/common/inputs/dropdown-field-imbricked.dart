import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import '../helpers/utils.dart';
import 'models/android-dropdown-imbricked-model.dart';
import 'models/ios-dropdown-model.dart';

class DropDownFieldImbricked extends StatefulWidget{
  dynamic value;
  List<Widget> items;
  List<Widget> selectedItems;
  void Function(dynamic) onChanged;


  DropDownFieldImbricked({
    super.key,
    this.value,
    required this.onChanged,
    required this.items,
    required this.selectedItems,
  });

  @override
  DropDownFieldImbrickedState createState() => DropDownFieldImbrickedState();
}

class DropDownFieldImbrickedState extends State<DropDownFieldImbricked>{


  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {

    return !Utils.isAndroid(context) ? SizedBox(
      width: 70,
      child: AndroidDropdownImbrickedModel(
        onChanged: widget.onChanged,
        elements: widget.items,
        selectedItems: widget.selectedItems,
        value: widget.value,
        context: context,
      ),
    ) :
      InkWell(
        child: Container(
          padding: const EdgeInsets.all(12),
          width: 65,
          decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(5),
              border: Border.all(color: Colors.transparent)
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              widget.selectedItems[widget.value ?? 0],
              Container(
                height: 40,
                width: 3,
                decoration: const BoxDecoration(
                    color: Colors.black26
                ),
              )
            ],
          ),
        ),
        onTap: (){
          showCupertinoModalPopup<void>(
            context: context,
            builder: (BuildContext context) => Container(
                height: 200,
                padding: const EdgeInsets.only(top: 6.0),
                margin: EdgeInsets.only(
                  bottom: MediaQuery.of(context).viewInsets.bottom,
                ),
                child: iOSDropdownModel(
                    items: widget.items.map((item){
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8.0),
                        child: item,
                      );
                    }).toList(),
                    onSelectedItemChanged: widget.onChanged
                )
            ),
          );
        },
      );

  }
}